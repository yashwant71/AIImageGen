const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;
const axios = require("axios");
const { HttpsProxyAgent } = require("https-proxy-agent");
const { SocksProxyAgent } = require("socks-proxy-agent");

app.use(bodyParser.json());

let workingProxies = [];

const proxySources = [
  {
    url: "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/http.txt",
    protocol: "http",
  },
  {
    url: "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks4.txt",
    protocol: "socks4",
  },
  {
    url: "https://raw.githubusercontent.com/TheSpeedX/SOCKS-List/master/socks5.txt",
    protocol: "socks5",
  },
];

async function fetchProxyList() {
  let allProxies = [];
  for (const source of proxySources) {
    try {
      const response = await axios.get(source.url, { timeout: 10000 });
      const proxies = response.data
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => ({
          url: `${source.protocol}://${line.trim()}`,
          protocol: source.protocol,
        }));
      allProxies = allProxies.concat(proxies);
    } catch (error) {
      console.error(`Error fetching from ${source.url}:`, error.message);
    }
  }
  return allProxies;
}

async function testProxy(proxyData) {
  try {
    let agent;
    if (proxyData.protocol === "socks4" || proxyData.protocol === "socks5") {
      agent = new SocksProxyAgent(proxyData.url);
    } else {
      agent = new HttpsProxyAgent(proxyData.url);
    }

    await axios.get("https://api.ipify.org", {
      httpsAgent: agent,
      timeout: 5000,
    });
    console.log(`Proxy ${proxyData.url} is working`);
    workingProxies.push(proxyData);
    console.log(`Total working proxies: ${workingProxies.length}`);
    return true;
  } catch (error) {
    return false;
  }
}

async function refreshProxyPool() {
  const proxyList = await fetchProxyList();
  const testPromises = proxyList.map(testProxy);
  await Promise.allSettled(testPromises);
  console.log(
    `Refreshed proxy pool. Working proxies: ${workingProxies.length}`
  );
}

function getRandomProxy() {
  if (workingProxies.length === 0) {
    return null;
  }
  return workingProxies[Math.floor(Math.random() * workingProxies.length)];
}

function removeProxy(proxy) {
  const index = workingProxies.findIndex((p) => p.url === proxy.url);
  if (index !== -1) {
    workingProxies.splice(index, 1);
    console.log(`Removed non-working proxy: ${proxy.url}`);
    console.log(`Remaining working proxies: ${workingProxies.length}`);
  }
}

async function makeRequest(url, method, data, retryCount = 0) {
  const maxRetries = 3;
  const proxy = getRandomProxy();
  
  try {
    let config = {
      url,
      method,
      data,
      timeout: 30000,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    };

    if (proxy) {
      const agent = proxy.protocol === "socks4" || proxy.protocol === "socks5"
        ? new SocksProxyAgent(proxy.url)
        : new HttpsProxyAgent(proxy.url);
      config.httpsAgent = agent;
    }

    const response = await axios(config);
    return response;
  } catch (error) {
    console.error(`Attempt ${retryCount + 1} failed: ${error.message}`);
    
    if (proxy) {
      removeProxy(proxy);
    }

    if (retryCount < maxRetries - 1) {
      return makeRequest(url, method, data, retryCount + 1);
    } else {
      throw error;
    }
  }
}

async function pollForCompletion(url, sessionHash, maxAttempts = 60, interval = 1000) {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const response = await makeRequest(url, 'get', null);
      const eventData = response.data;
      
      if (eventData.msg === "process_completed") {
        return eventData;
      } else if (eventData.msg === "process_starts") {
        console.log("Process started, continuing to poll...");
      } else if (eventData.msg === "queue_full") {
        console.log("Queue is full, retrying...");
        await new Promise(resolve => setTimeout(resolve, interval * 2));
        continue;
      }
    } catch (error) {
      console.error(`Polling attempt ${i + 1} failed:`, error.message);
      if (error.response && error.response.status === 404) {
        console.log("Session not found, stopping poll");
        throw new Error("Session not found");
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, interval));
  }
  
  throw new Error("Polling timed out");
}

app.post("/api/gradio", async (req, res) => {
  const input = req.body;
  const sessionHash = Math.random().toString(36).substring(2);
  const payloadForapi = {
    data: input.payload,
    event_data: null,
    fn_index: input.fn_index || 3,
    trigger_id: input.trigger_id || 6,
    session_hash: sessionHash,
  };

  try {
    // Step 1: Make the initial POST request to join the queue
    await makeRequest(
      `https://${input.selectedApi}.hf.space/queue/join`,
      'post',
      payloadForapi
    );

    // Step 2: Poll for process completion
    const eventData = await pollForCompletion(
      `https://${input.selectedApi}.hf.space/queue/data?session_hash=${sessionHash}`,
      sessionHash
    );

    if (eventData?.output?.data?.[0]?.[0]?.image?.url) {
      res.json(eventData.output.data[0][0].image.url);
    } else if (eventData?.output?.data?.[0]?.url) {
      res.json(eventData.output.data[0].url);
    } else {
      res.status(500).json({ message: "URL not found" });
    }
    console.log("eventData", eventData);

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
  refreshProxyPool(); // Initial proxy pool population
});

// Refresh the proxy pool periodically
setInterval(refreshProxyPool, 5 * 60 * 1000); // Every 5 minutes

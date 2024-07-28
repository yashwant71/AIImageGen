const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;
const axios = require("axios");
const EventSource = require("eventsource");
const { HttpsProxyAgent } = require("https-proxy-agent");

app.use(bodyParser.json());

// Function to get a list of working proxies
async function getWorkingProxies() {
  try {
    const response = await axios.get("https://www.sslproxies.org/");
    const html = response.data;
    const ipRegex = /\d+\.\d+\.\d+\.\d+:\d+/g;
    const proxies = html.match(ipRegex);

    const workingProxies = [];
    for (const proxy of proxies) {
      try {
        // Test the proxy with a 5-second timeout
        await axios.get("https://httpbin.org/ip", {
          proxy: {
            host: proxy.split(":")[0],
            port: proxy.split(":")[1],
          },
          timeout: 5000,
        });
        workingProxies.push(proxy);
        if (workingProxies.length >= 0) break; // Stop after finding 5 working proxies
      } catch (error) {
        console.log(`Proxy ${proxy} failed`);
      }
    }
    return workingProxies;
  } catch (error) {
    console.error("Error fetching proxies:", error);
    return [];
  }
}

// Global variable to store working proxies
let workingProxies = [];

// Function to get a random working proxy
async function getRandomProxy() {
  if (workingProxies.length === 0) {
    workingProxies = await getWorkingProxies();
  }
  if (workingProxies.length === 0) {
    throw new Error("No working proxies available");
  }
  return workingProxies[Math.floor(Math.random() * workingProxies.length)];
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
    const proxy = await getRandomProxy();
    const proxyAgent = new HttpsProxyAgent(`http://${proxy}`);

    // Step 1: Make the initial POST request to join the queue
    await axios.post(
      `https://${input.selectedApi}.hf.space/queue/join?`,
      payloadForapi,
      {
        httpsAgent: proxyAgent,
        timeout: 10000, // 10 second timeout
      }
    );

    // Step 2: Setup event stream to listen for process completion
    const eventSource = new EventSource(
      `https://${input.selectedApi}.hf.space/queue/data?session_hash=${sessionHash}`,
      {
        agent: proxyAgent,
        https: { rejectUnauthorized: false }, // Note: This is not recommended for production use
      }
    );

    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      if (eventData.msg === "process_completed") {
        eventSource.close();

        if (eventData?.output?.data?.[0]?.[0]?.image?.url) {
          res.json(eventData?.output?.data?.[0]?.[0]?.image?.url);
        } else if (eventData?.output?.data?.[0]?.url) {
          res.json(eventData?.output?.data?.[0]?.url);
        } else {
          res.status(500).json({ message: "URL not found" });
        }
        console.log("eventData", eventData);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
      res.status(500).json({ error: "Failed to process the event stream" });
    };
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred", details: error.message });
  }
});

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Initialize working proxies on server start
(async () => {
  workingProxies = await getWorkingProxies();
  console.log(`Initialized with ${workingProxies.length} working proxies`);
})();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

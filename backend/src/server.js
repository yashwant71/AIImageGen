const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;
// import cors from "cors";
app.use(bodyParser.json());
const axios = require("axios");
const EventSource = require("eventsource");
var ProxyVerifier = require("proxy-verifier");
const HttpsProxyAgent = require("https-proxy-agent");

// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:4200", "http://localhost:5173"],
//   })
// );

// Function to get proxies from the API
async function getProxies() {
  try {
    const response = await axios.get(
      "https://api.proxyscrape.com/v3/free-proxy-list/get?request=displayproxies&protocol=http&proxy_format=protocolipport&format=text&timeout=1000"
    );
    const proxies = response.data.split("\n");
    return proxies;
  } catch (error) {
    console.error("Error getting proxies:", error);
    return [];
  }
}

async function testProxy(proxy) {
  try {
    const proxyProtocol = proxy.split("://")[0];
    const proxyIp = proxy.split("://")[1].split(":")[0];
    const proxyPort = proxy.split("://")[1].split(":")[1];

    const proxyObj = {
      ipAddress: proxyIp,
      port: proxyPort,
      protocol: proxyProtocol,
    };

    await new Promise((resolve, reject) => {
      ProxyVerifier.testProtocol(
        proxyObj,
        { timeout: 1000 },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    return true;
  } catch (error) {
    console.error("Error testing proxy:", error);
    return false;
  }
}
// Function to get a working proxy
async function getWorkingProxy() {
  const proxies = await getProxies();
  for (const proxy of proxies) {
    if (await testProxy(proxy)) {
      return proxy;
    }
  }
  return null;
}
app.post("/api/gradio", async (req, res) => {
  const input = req.body;
  // Math.random().toString(36).substring(2)
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

    await axios.post(
      `https://${input.selectedApi}.hf.space/queue/join?`,
      payloadForapi,
      {
        timeout: 12000000,
      }
    );

    const workingProxy = await getWorkingProxy();
    console.log("working", workingProxy);
    const proxyAgent = new HttpsProxyAgent(workingProxy);
    // Step 2: Setup event stream to listen for process completion

    const eventSourceOptions = {
      https: {
        rejectUnauthorized: false,
      },
      agent: proxyAgent,
    };
    const eventSource = new EventSource(
      `https://${input.selectedApi}.hf.space/queue/data?session_hash=${sessionHash}`,
      eventSourceOptions
    );
    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      if (eventData.msg === "process_completed") {
        // Close the event stream
        eventSource.close();

        // Return the completed data to the frontend

        if (eventData?.output?.data?.[0]?.[0]?.image?.url) {
          res.json(eventData?.output?.data?.[0]?.[0]?.image?.url);
        } else if (eventData?.output?.data?.[0]?.url) {
          // for prodia/sdxl-stable-diffusion-xl
          console.log("output::::", eventData?.output?.data?.[0]);
          res.json(eventData?.output?.data?.[0]?.url);
        } else if (eventData?.output?.error) {
          const errorMessage = eventData.output.error;
          if (errorMessage.includes("No GPU")) {
            res.status(402).json({
              message: "Server not available, try again later",
            });
          } else {
            res.status(402).json({
              message:
                "limit exceeded, use a vpn (change the location of vpn if already using one)",
            });
          }
          console.log(eventData?.output?.error);
        } else {
          res.status(500).json({ message: "not found the url " });
        }
      } else {
        console.log(eventData);
      }
    };

    eventSource.onerror = (err) => {
      console.error("EventSource failed:", err);
      eventSource.close();
      res.status(500).json({ error: "Failed to process the event stream" });
    };
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }

  // Here you can process the formPayload as needed
  // For demonstration, we'll just send back a mock response
  // const mockResponse = {
  //   data: [
  //     [
  //       {
  //         image: {
  //           url: "https://example.com/image.jpg",
  //         },
  //       },
  //     ],
  //   ],
  // };

  // Simulate async processing
  // setTimeout(() => {
  //   res.json(mockResponse);
  // }, 1000);
});

app.use(express.static("public"));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

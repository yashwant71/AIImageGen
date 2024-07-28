const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
const port = 3000;
// import cors from "cors";
app.use(bodyParser.json());
const axios = require("axios");
const EventSource = require("eventsource");

// app.use(
//   cors({
//     credentials: true,
//     origin: ["http://localhost:4200", "http://localhost:5173"],
//   })
// );

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
      { timeout: 12000000 }
    );
    // const sessionHash = joinQueueResponse.data.session_hash;

    // Step 2: Setup event stream to listen for process completion
    const eventSource = new EventSource(
      `https://${input.selectedApi}.hf.space/queue/data?session_hash=${sessionHash}`
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
          res.json(eventData?.output?.data?.[0]?.url);
        } else {
          res.status(500).json({ message: "not found the url " });
        }
        console.log("eveedata", eventData);
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

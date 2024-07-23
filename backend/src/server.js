const express = require("express");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

app.use(bodyParser.json());

app.post("/run", async (req, res) => {
  const formPayload = req.body;

  // Here you can process the formPayload as needed
  // For demonstration, we'll just send back a mock response
  const mockResponse = {
    data: [
      [
        {
          image: {
            url: "https://example.com/image.jpg",
          },
        },
      ],
    ],
  };

  // Simulate async processing
  setTimeout(() => {
    res.json(mockResponse);
  }, 1000);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

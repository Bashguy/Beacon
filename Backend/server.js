const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("If you are ever alone at night our beacon will be your light🚶");
});

app.post("/route", async (req, res) => {
  const { origin, destination } = req.body;
  if (!origin || !destination) {
    return res.status(400).json({ error: "Origin and destination required" });
  }

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&key=${apiKey}`;
    const response = await axios.get(url);

    if (!response.data.routes.length) {
      return res.status(404).json({ error: "No route found" });
    }

    const leg = response.data.routes[0].legs[0];
    const routeInfo = {
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps: leg.steps.map(step => step.html_instructions.replace(/<[^>]*>/g, '')), // plain text
    };

    res.json(routeInfo);
  } catch (error) {
    console.error(error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
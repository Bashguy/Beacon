const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

app.use(cors());
app.use(express.json());

async function geocodeLocation(query) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
  const { data } = await axios.get(url);
  if (!data.results.length) throw new Error("No geocode match for safe zone");

  const top = data.results[0];
  return {
    name: top.address_components[0]?.long_name || top.formatted_address || query,
    formattedAddress: top.formatted_address,
    location: top.geometry.location, // { lat, lng }
    placeId: top.place_id,
  };
}

app.post("/route", async (req, res) => {
  const { origin, destination } = req.body;
  if (!origin || !destination) return res.status(400).json({ error: "Origin and destination required" });

  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&mode=walking&key=${apiKey}`;
    const response = await axios.get(url);

    if (!response.data.routes.length) return res.status(404).json({ error: "No route found" });

    const leg = response.data.routes[0].legs[0];
    const steps = leg.steps.map(step => ({
      instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
      distance: step.distance.text,
      duration: step.duration.text
    }));

    res.json({
      distance: leg.distance.text,
      duration: leg.duration.text,
      steps
    });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch route" });
  }
});

app.post("/save-contacts", async (req, res) => {
  const { userId, contacts } = req.body;
  if (!userId || !contacts) return res.status(400).json({ error: "User ID and contacts required" });

  try {
    await db.collection("users").doc(userId).set({ contacts }, { merge: true });
    res.json({ success: true, contacts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save contacts" });
  }
});

app.post("/save-safezones", async (req, res) => {
  const { userId, safeZones } = req.body;
  if (!userId || !safeZones) {
    return res.status(400).json({ error: "User ID and safe zones required" });
  }

  try {
    // Normalize to array
    const zonesArray = Array.isArray(safeZones) ? safeZones : [safeZones];
    const enriched = await Promise.all(
      zonesArray.map(async zone => {
        if (typeof zone === "string") return geocodeLocation(zone);
        if (zone.location?.lat && zone.location?.lng) return zone; // already geocoded
        if (zone.name || zone.formattedAddress) return geocodeLocation(zone.name || zone.formattedAddress);
        throw new Error("Invalid safe zone entry");
      })
    );

    await db.collection("users").doc(userId).set({ safeZones: enriched }, { merge: true });
    res.json({ success: true, safeZones: enriched });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to save safe zones" });
  }
});

app.post("/notify", async (req, res) => {
  const { userId, message, status } = req.body;
  if (!userId || !message) return res.status(400).json({ error: "User ID and message required" });

  try {
    const userDoc = await db.collection("users").doc(userId).get();
    if (!userDoc.exists) return res.status(404).json({ error: "User not found" });

    const { contacts } = userDoc.data();
    if (!contacts || !contacts.length) return res.status(404).json({ error: "No contacts found" });

    contacts.forEach(contact => {
      console.log(`Notify ${contact}: ${message} (status: ${status || "update"})`);
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to notify contacts" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
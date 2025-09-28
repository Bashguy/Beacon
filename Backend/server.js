const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccount.json");
const nodemailer = require("nodemailer");

const mailer = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DB_URL,
});

const rtdb = admin.database();
const statusRef = rtdb.ref("deviceStatus");
const db = admin.firestore();
const app = express();
const PORT = process.env.PORT || 3000;
const apiKey = process.env.GOOGLE_MAPS_API_KEY;

app.use(cors());
app.use(express.json());

async function sendContactEmails(userId, { subject, body, status }) {
  const userDoc = await db.collection("users").doc(userId).get();
  if (!userDoc.exists) throw new Error("User not found");

  const { contacts } = userDoc.data();
  if (!contacts?.length) throw new Error("No contacts found");

  const formattedStatus = status ? ` (status: ${status})` : "";
  const html = `<p>${body}${formattedStatus}</p>`;
  const text = `${body}${formattedStatus}`;

  await Promise.all(
    contacts.map(async contact => {
      if (!contact.email) {
        console.warn(`Skipping contact without email: ${contact.firstName} ${contact.lastName}`);
        return;
      }

      await mailer.sendMail({
        to: contact.email,
        from: process.env.EMAIL_FROM,
        subject,
        text,
        html,
      });
    })
  );
}

async function geocodeLocation(query) {
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
  const { data } = await axios.get(url);
  if (!data.results.length) throw new Error("No geocode match for safe zone");

  const top = data.results[0];
  return {
    userInput: query, //place the user typed
    googleName: top.address_components[0]?.long_name || top.formatted_address || query,
    formattedAddress: top.formatted_address,
    location: top.geometry.location, // { lat, lng }
    placeId: top.place_id,
  };
}

function normalizeLocation(input) {
  if (typeof input === "string") return input;
  if (input && typeof input === "object" && input.lat != null && input.lng != null) {
    return `${input.lat},${input.lng}`;
  }
  throw new Error("Invalid location format. Provide a string or { lat, lng }.");
}

async function fetchEta(origin, destination) {
  const originParam = encodeURIComponent(normalizeLocation(origin));
  const destinationParam = encodeURIComponent(normalizeLocation(destination));
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${originParam}&destination=${destinationParam}&mode=walking&key=${apiKey}`;

  const { data } = await axios.get(url);
  if (!data.routes.length) throw new Error("No route found");

  const leg = data.routes[0].legs[0];
  const durationSeconds = leg.duration.value;
  const arrival = new Date(Date.now() + durationSeconds * 1000);

  return {
    distanceText: leg.distance.text,
    durationText: leg.duration.text,
    etaDisplay: arrival.toLocaleString(),
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
    const etaSeconds = leg.duration.value; // seconds
    const etaDate = new Date(Date.now() + etaSeconds * 1000);
    const eta = etaDate.toLocaleString(); // or format however you like
    const steps = leg.steps.map(step => ({
      instruction: step.html_instructions.replace(/<[^>]*>/g, ''),
      distance: step.distance.text,
      duration: step.duration.text,
      eta
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

  const contactsArray = Array.isArray(contacts) ? contacts : [contacts];
  if (!contactsArray.length) {
    return res.status(400).json({ error: "At least one contact required" });
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const normalized = contactsArray.map(contact => {
    if (typeof contact === "string") {
      throw new Error("Use contact objects with firstName, lastName, phone, email");
    }
    const firstName = contact.firstName?.trim();
    const lastName = contact.lastName?.trim();
    const phone = contact.phone?.replace(/\D/g, "");
    //ensure email is in standard email format
    const email = contact.email?.trim().toLowerCase();
    if (!email || !EMAIL_REGEX.test(email)) {
      throw new Error("Contact must include a valid email address");
    }
    return { firstName, lastName, phone, email };
  });

  try {
    await db.collection("users").doc(userId).set({ contacts: normalized }, { merge: true });
    res.json({ success: true, contacts: normalized });
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
        if (typeof zone === "string")
          { 
            const geo = await geocodeLocation(zone);
            return { ...geo, name: zone, userInput: zone };
          }
        if (zone.location?.lat && zone.location?.lng) 
          return {
            ...zone, // already geocoded
            googleName: zone.googleName || zone.name,
            name: zone.name || zone.userInput,
            userInput: zone.userInput || zone.name || zone.formattedAddress,
        };
        if (zone.name || zone.formattedAddress) {
          const label = zone.name || zone.formattedAddress;
          const geo = await geocodeLocation(label);
          return { ...geo, name: zone.name || zone.userInput || 
            label, userInput: zone.userInput || label, };
        }
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
  const { userId, message, status, subject = `Beacon update from ${userId}` } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "User ID and message required" });
  }

  try {
    await sendContactEmails(userId, { subject, body: message, status });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to notify contacts" });
  }
});

app.post("/notify-start", async (req, res) => {
  const { userId, destination, eta } = req.body;
  if (!userId || !destination || !eta) {
    return res
      .status(400)
      .json({ error: "User ID, destination, and ETA required" });
  }

  try {
    const body = `I'm heading to ${destination} with an ETA of ${eta}.`;
    await sendContactEmails(userId, {
      subject: "Beacon journey started",
      body,
      status: "en route",
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: err.message || "Failed to send journey start update" });
  }
});

app.post("/notify-arrival", async (req, res) => {
  const { userId, destination } = req.body;
  if (!userId || !destination) {
    return res.status(400).json({ error: "User ID and destination required" });
  }

  try {
    const body = `I made it safely to ${destination}`;
    await sendContactEmails(userId, {
      subject: "Beacon arrival update",
      body,
      status: "arrived",
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to send arrival update" });
  }
});

app.post("/notify-status", async (req, res) => {
  const { userId, origin, destination} = req.body;
  if (!userId || !origin || !destination) {
    return res.status(400).json({ error: "User ID, origin, and destination required" });
  }

  try {
    const etaInfo = await fetchEta(origin, destination);
    const body = `I feel unsafe. Current ETA to ${destination}: ${etaInfo.etaDisplay} (${etaInfo.durationText} remaining).`;

    await sendContactEmails(userId, {
      subject: `Beacon safety alert from ${userId}`,
      body,
      status: "unsafe",
    });

    res.json({ success: true, eta: etaInfo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message || "Failed to send status update" });
  }
});

//waiting for frontend react native expo battery status 
statusRef.on("child_changed", async snapshot => {
  const userId = snapshot.key;
  const status = snapshot.child("state").val();
  if (status !== "dead") return;

  const battery = snapshot.child("battery").val();
  const address = snapshot.child("address").val();
  
  const bodyLines = [
    "My phone shut off unexpectedly.",
    battery != null ? `Battery: ${(battery * 100).toFixed(0)}%` : null,
    address ? `Last reported location: ${address}` : null,
  ].filter(Boolean);

  try {
    await sendContactEmails(userId, {
      subject: `Beacon phone-off alert for ${userId}`,
      body: bodyLines.join("\n"),
      status: "device offline",
    });
    console.log(`Sent phone-dead alert for user ${userId}`);
  } catch (err) {
    console.error(`Failed to send phone-dead alert for ${userId}`, err);
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("If you are ever alone at night our beacon will be your light🚶");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
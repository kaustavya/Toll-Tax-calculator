const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const { calculateToll } = require('./tollCalculator');
const { env } = require('process');

dotenv.config();

const app = express();
const port = 8000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/calculate-toll', async (req, res) => {
  try {
    console.log(req.body)
    const { startPoint, endPoint, vehicleType, localRoadRate, highwayRate } = req.body;
    const result = await calculateToll(startPoint, endPoint, vehicleType, localRoadRate, highwayRate);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
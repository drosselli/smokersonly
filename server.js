const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const googlePlacesAPIKey = 'AIzaSyBWLj7oVCt8GcZpTm6U4-pOXYXEJkvzhBI';

app.use(cors());

// Serve the smokers.html page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'smokers.html'));
});

// Keyword-based search route with 5-mile radius
app.get('/places', async (req, res) => {
  const { lat, lon } = req.query;

  if (!lat || !lon) {
    return res.status(400).json({ error: 'Missing lat or lon parameters' });
  }

  const radius = 8000; // 5 miles

  try {
    const response = await axios.get('https://maps.googleapis.com/maps/api/place/nearbysearch/json', {
      params: {
        location: `${lat},${lon}`,
        radius,
        keyword: 'cigarettes',
        key: googlePlacesAPIKey
      }
    });

    console.log(response.data); // Log the full response for debugging

    res.json({ results: response.data.results });
  } catch (error) {
    console.error('Error fetching from Google Places API:', error.message);
    res.status(500).json({ error: 'Failed to fetch from Google Places API' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});

const axios = require('axios');

async function calculateToll(startPoint, endPoint, vehicleType, localRoadRate, highwayRate) {
  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${startPoint}&destination=${endPoint}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const route = response.data.routes[0];

    let totalDistance = 0;
    let highwayDistance = 0;
    let localRoadDistance = 0;
    let timeTaken = 0;

    route.legs.forEach(leg => {
      totalDistance += leg.distance.value;
      timeTaken += leg.duration.value;

      leg.steps.forEach(step => {
        if (step.travel_mode === 'DRIVING') {
          if (step.html_instructions.toLowerCase().includes('highway') || 
              step.html_instructions.toLowerCase().includes('motorway')) {
            highwayDistance += step.distance.value;
          } else {
            localRoadDistance += step.distance.value;
          }
        }
      });
    });

    totalDistance /= 1000; // Convert to km
    highwayDistance /= 1000;
    localRoadDistance /= 1000;

    const localRoadTax = localRoadDistance * localRoadRate;
    const highwayTax = highwayDistance * highwayRate;
    const totalTax = localRoadTax + highwayTax;

    return {
      totalDistance: totalDistance.toFixed(2),
      localRoadDistance: localRoadDistance.toFixed(2),
      highwayDistance: highwayDistance.toFixed(2),
      timeTaken: formatTime(timeTaken),
      localRoadTax: localRoadTax.toFixed(2),
      highwayTax: highwayTax.toFixed(2),
      totalTax: totalTax.toFixed(2)
    };
  } catch (error) {
    throw new Error('Error calculating toll: ' + error.message);
  }
}

function formatTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return `${hours} hours ${minutes} minutes`;
}

module.exports = { calculateToll };
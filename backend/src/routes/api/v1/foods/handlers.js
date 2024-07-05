import { prisma } from "../../../../adapters.js";
import axios from 'axios';

const origin = { latitude: 25.0409803, longitude: 121.521604 };

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

async function getGeocode(address) {
  if (!address) {
      console.log("Address is empty.");
      return { latitude: null, longitude: null };
  }

  try {
      const apiKey = process.env.GOOGLEMAP_API_KEY;
      
      const response = await axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
          params: {
              address: address,
              key: apiKey
          }
      });

      if (response.data.status === "OK" && response.data.results.length > 0) {
          const { lat, lng } = response.data.results[0].geometry.location;
          return { latitude: lat, longitude: lng };
      } else {
          console.log("Failed to get geocode for address:", address);
          return { latitude: null, longitude: null };
      }
  } catch (error) {
      console.error('Error geocoding address:', error);
      return { latitude: null, longitude: null };
  }
}

async function calculateTravelTime(destination) {
  const apiKey = process.env.GOOGLEMAP_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&mode=walking&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    if (data.rows[0].elements[0].status === 'OK') {
      const durationText = data.rows[0].elements[0].duration.text;
      return parseDuration(durationText);
    } else {
      console.error('Error calculating distance:', data.rows[0].elements[0].status);
      return null;
    }
  } catch (error) {
    console.error('Error fetching distance data:', error);
    return null;
  }
};

function parseDuration(durationText) {
  let totalMinutes = 0;

  const regex = /(\d+)\s*(hour|minute|mins|hr|h|m)/g;
  let match;

  while ((match = regex.exec(durationText)) !== null) {
    const value = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    if (unit.startsWith('hour') || unit.startsWith('hr') || unit.startsWith('h')) {
      totalMinutes += value * 60;
    } else if (unit.startsWith('minute') || unit.startsWith('min') || unit.startsWith('m')) {
      totalMinutes += value;
    }
  }

  return totalMinutes;
}

export async function getAllRestaurant(req, res) {
    // 確保將 query 參數轉換為數組，處理單個值時轉換為數組
    const processQueryParam = param => (Array.isArray(param) ? param : param ? [param] : []);

    const { style = [], type = [], price = [], travelTime = [] } = req.query;

    const styleArray = processQueryParam(style);
    const typeArray = processQueryParam(type);
    const priceArray = processQueryParam(price);
    const travelTimeArray = processQueryParam(travelTime)
    .filter(timeRange => timeRange.trim() !== "") // 过滤掉空字符串
    .map(timeRange => {
      let min = 0;
      let max = 9999999;
      if (timeRange.startsWith('<')) {
        max = parseInt(timeRange.slice(1), 10);
      } else if (timeRange.startsWith('>')) {
        min = parseInt(timeRange.slice(1), 10);
      } else {
        [min, max] = timeRange.split('-').map(Number);
      }
      return { min, max };
    })
    .filter(range => !isNaN(range.min) && !isNaN(range.max)); // 过滤掉无效的范围

    try {
        const foods = await prisma.food.findMany({
            where: {
                style: styleArray.length > 0 ? { in: styleArray } : undefined,
                type: typeArray.length > 0 ? { in: typeArray } : undefined,
                price: priceArray.length > 0 ? { in: priceArray } : undefined,
                OR: travelTimeArray.length > 0 ? travelTimeArray.map(range => ({
                  travelTime: {
                    gte: range.min,
                    lte: range.max
                  }
                })) : undefined,
            },
        });

        res.json(foods);
    } catch (error) {
        console.error('Error fetching food data:', error);
        res.status(500).json({ error: 'An error occurred while fetching food data.' });
    }
}

export async function createRestaurant(req, res) {
  const { newRestaurant } = req.body;
  const { name, style, type, price, address } = newRestaurant;
  try {
      const { latitude, longitude } = await getGeocode(address);
      const travelTime = await calculateTravelTime({ latitude: latitude, longitude: longitude });

      if (travelTime === null) {
        return res.status(500).json({ error: 'Error calculating travel time' });
      }
      
      const restaurant = await prisma.food.upsert({
          where: {
            name: name,
          },
          update: {
            style: style,
            type: type,
            price: price,
            travelTime: travelTime,
            address: address,
            latitude: latitude,
            longitude: longitude,
          },
          create: {
            name: name,
            style: style,
            type: type,
            price: price,
            travelTime: travelTime,
            address: address,
            latitude: latitude,
            longitude: longitude,
          }
      });
      res.status(201).json(restaurant);
  } catch (error) {
      console.error('Error adding new restaurant:', error);
      res.status(500).json({ error: 'An error occurred while adding new restaurant.' });
  }
}

export async function deleteRestaurant(req, res) {
  const { id } = req.params;

  try {
    const restaurantId = parseInt(id, 10);
    if (isNaN(restaurantId)) {
      return res.status(400).json({ error: 'Invalid restaurant ID.' });
    }

    await prisma.food.delete({
      where: { id: restaurantId },
    });

    res.status(204).end();
  } catch (error) {
    console.error('Error deleting restaurant:', error);

    if (error.code === 'P2025') {  // Prisma's specific error code for record not found
      return res.status(404).json({ error: 'Restaurant not found.' });
    }

    res.status(500).json({ error: 'An error occurred while deleting the restaurant.' });
  }
}

export async function drawRestaurants(req, res) {
    const processQueryParam = param => (Array.isArray(param) ? param : param ? [param] : []);
    const { style = [], type = [], price = [], travelTime = [], numRestaurants = 1 } = req.query;

    const styleArray = processQueryParam(style);
    const typeArray = processQueryParam(type);
    const priceArray = processQueryParam(price);
    const travelTimeArray = processQueryParam(travelTime)
    .filter(timeRange => timeRange.trim() !== "") // 过滤掉空字符串
    .map(timeRange => {
        let min = 0;
        let max = 9999999; // 设定一个非常大的数作为上限
        if (timeRange.startsWith('<')) {
          max = parseInt(timeRange.slice(1), 10);
        } else if (timeRange.startsWith('>')) {
          min = parseInt(timeRange.slice(1), 10);
        } else {
          [min, max] = timeRange.split('-').map(Number);
        }
        return { min, max };
    })
    .filter(range => !isNaN(range.min) && !isNaN(range.max)); // 过滤掉无效的范围

    try {
        // Find all restaurants that match the filter criteria
        const matchedRestaurants = await prisma.food.findMany({
            where: {
              style: styleArray.length > 0 ? { in: styleArray } : undefined,
              type: typeArray.length > 0 ? { in: typeArray } : undefined,
              price: priceArray.length > 0 ? { in: priceArray } : undefined,
              OR: travelTimeArray.length > 0 ? travelTimeArray.map(range => ({
                travelTime: {
                  gte: range.min,
                  lte: range.max
                }
              })) : undefined,
            },
        });

        if (matchedRestaurants.length <= numRestaurants) {
            // If the number of matched restaurants is less than or equal to numRestaurants,
            // return all matched restaurants
            res.json(matchedRestaurants);
        } else {
            // Otherwise, randomly select numRestaurants from matchedRestaurants
            const shuffled = matchedRestaurants.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, numRestaurants);
            res.json(selected);
        }
    } catch (error) {
        console.error('Error drawing restaurants:', error);
        res.status(500).json({ error: 'An error occurred while drawing restaurants.' });
    }
}

export async function getCandidates(req, res) {
  try {
    const candidates = await prisma.candidate.findMany();
    res.status(200).json(candidates);
  } catch (error) {
    console.error('Error fetching candidates:', error);
    res.status(500).json({ error: 'An error occurred while fetching candidates.' });
  }
}

export async function createCandidate(req, res) {
  const { newCandidate } = req.body;
  const { name, style, type, price, address } = newCandidate;

  try {
    const candidate = await prisma.candidate.create({
      data: {
        name,
        style,
        type,
        price,
        address,
      }
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error adding new candidate:', error);
    res.status(500).json({ error: 'An error occurred while adding new candidate.' });
  }
}

export async function deleteCandidate(req, res) {
  const { id } = req.params;

  try {
    await prisma.candidate.delete({
      where: { id: parseInt(id, 10) }
    });
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting candidate:', error);
    res.status(500).json({ error: 'An error occurred while deleting candidate.' });
  }
}




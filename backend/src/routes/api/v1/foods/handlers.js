import { prisma } from "../../../../adapters.js";
import axios from 'axios';

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

export async function getAllRestaurant(req, res) {
    // 確保將 query 參數轉換為數組，處理單個值時轉換為數組
    const processQueryParam = param => (Array.isArray(param) ? param : param ? [param] : []);

    const { style = [], type = [], price = [], arr_time = [] } = req.query;

    const styleArray = processQueryParam(style);
    const typeArray = processQueryParam(type);
    const priceArray = processQueryParam(price);
    const arrTimeArray = processQueryParam(arr_time);

    try {
        const foods = await prisma.food.findMany({
            where: {
                style: styleArray.length > 0 ? { in: styleArray } : undefined,
                type: typeArray.length > 0 ? { in: typeArray } : undefined,
                price: priceArray.length > 0 ? { in: priceArray } : undefined,
                arr_time: arrTimeArray.length > 0 ? { in: arrTimeArray } : undefined,
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
  const { name, style, type, price, arr_time, address } = newRestaurant;
  try {
      const { latitude, longitude } = await getGeocode(address);
      
      const restaurant = await prisma.food.upsert({
          where: {
            name: name,
          },
          update: {
            style: style,
            type: type,
            price: price,
            arr_time: arr_time,
            address: address,
            latitude: latitude,
            longitude: longitude,
          },
          create: {
            name: name,
            style: style,
            type: type,
            price: price,
            arr_time: arr_time,
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

export async function drawRestaurants(req, res) {
    const { style = [], type = [], price = [], arr_time = [], numRestaurants = 1 } = req.query;

    const parseFilter = (filter) => Array.isArray(filter) ? filter : [filter];

    const filter = {};
    if (style.length) filter.style = { in: parseFilter(style) };
    if (type.length) filter.type = { in: parseFilter(type) };
    if (price.length) filter.price = { in: parseFilter(price) };
    if (arr_time.length) filter.arr_time = { in: parseFilter(arr_time) };

    try {
        // Find all restaurants that match the filter criteria
        const matchedRestaurants = await prisma.food.findMany({
            where: filter,
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
  const { name, style, type, price, arr_time, address } = newCandidate;

  try {
    const candidate = await prisma.candidate.create({
      data: {
        name,
        style,
        type,
        price,
        arr_time,
        address,
      }
    });

    res.status(201).json(candidate);
  } catch (error) {
    console.error('Error adding new candidate:', error);
    res.status(500).json({ error: 'An error occurred while adding new candidate.' });
  }
}




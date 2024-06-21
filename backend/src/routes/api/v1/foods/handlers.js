import { prisma } from "../../../../adapters.js";
import { fileTypeFromBuffer } from 'file-type';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function getAllRestaurant(req, res) {
    // 確保將 query 參數轉換為數組，處理單個值時轉換為數組
    const processQueryParam = param => (Array.isArray(param) ? param : param ? [param] : []);

    //const filters = req.query;
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
  const { name, style, type, price, arr_time } = newRestaurant;
  try {
      const existingRestaurant = await prisma.food.findUnique({
        where: {
          name: name,
        },
      });
    
      if (existingRestaurant) {
        return res.status(400).json({ message: 'Restaurant already exists.' });
      }
      
      const restaurant = await prisma.food.create({
          data: {
              name:name,
              style:style,
              type:type,
              price:price,
              arr_time:arr_time
          }
      });
      res.status(201).json(restaurant);
  } catch (error) {
      console.error('Error adding new restaurant:', error);
      res.status(500).json({ error: 'An error occurred while adding new restaurant.' });
  }
}

export async function drawRestaurants(req, res) {
  const { style = [], type = [], price = [], arr_time = [], num } = req.query;
  const numRestaurants = parseInt(num, 10) || 1;

  try {
      const filters = {
          ...(style.length > 0 && { style: { in: style } }),
          ...(type.length > 0 && { type: { in: type } }),
          ...(price.length > 0 && { price: { in: price } }),
          ...(arr_time.length > 0 && { arr_time: { in: arr_time } })
      };

      const allRestaurants = await prisma.food.findMany({ where: filters });
      const shuffled = allRestaurants.sort(() => 0.5 - Math.random());
      const selectedRestaurants = shuffled.slice(0, numRestaurants);

      res.json(selectedRestaurants);
  } catch (error) {
      console.error('Error drawing restaurants:', error);
      res.status(500).json({ error: 'An error occurred while drawing restaurants.' });
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getRestaurant(req, res) {
  try {
    const username = req.session.username;
    if (!username) return res.status(401).json({ error: "User not authenticated" });

    const user = await prisma.user.findUnique({ 
      where: { username: username },
      select: {
        username: true,
        avatar: true,
      } });
    if (!user) return res.status(404).json({ error: "User not found" });

    return res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * 上傳使用者頭像
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function uploadPic(req, res) {
  try {
    const base64Image = req.body.avatar;
    const username = req.session.username;

    if (!username) {
      return res.status(401).json({ message: 'User not authenticated.' });
    }

    const user = await prisma.user.findUnique({ where: { username: username } });
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // 檢查檔案類型是否為 JPEG 或 PNG
    const isValidFormat = /^data:image\/(jpeg|png);base64,/.test(base64Image);
    if (!isValidFormat) {
      return res.status(400).json({ message: 'Please upload a JPEG or PNG image.' });
    }
    
    const base64WithoutHeader = base64Image.substring(base64Image.indexOf(',') + 1);
    const buffer = Buffer.from(base64WithoutHeader, 'base64');
    const type = await fileTypeFromBuffer(buffer);
    if (!type || (type.mime !== 'image/jpeg' && type.mime !== 'image/png')) {
      return res.status(400).json({ message: 'Please upload a JPEG or PNG image.' });
    }

    // 更新使用者的圖片字段
    const updatedUser = await prisma.user.update({
      where: { username: username },
      data: {
        avatar: base64Image
      },
      select: {
        username: true,
        avatar: true,
      }
    });

    // 回應成功訊息
    res.status(200).json({ message: 'Image uploaded successfully.', user: updatedUser });
  } catch (error) {
    console.error('Error uploading image:', error);
    // 返回錯誤的回應給前端
    res.status(500).json({ message: 'Error uploading image.' });
  }
}


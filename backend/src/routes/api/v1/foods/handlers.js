import { prisma } from "../../../../adapters.js";
import { fileTypeFromBuffer } from 'file-type';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */

export async function getAllRestaurant(req, res) {
  const filters = req.query;
  const { style = [], type = [], price = [], arr_time = [] } = filters;

    try {
        const foods = await prisma.food.findMany({
            where: {
                style: {
                    in: style.length > 0 ? style : undefined,
                },
                type: {
                    in: type.length > 0 ? type : undefined,
                },
                price: {
                    in: price.length > 0 ? price : undefined,
                },
                arr_time: {
                    in: arr_time.length > 0 ? arr_time : undefined,
                },
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


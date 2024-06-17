import { prisma } from "../../../../adapters.js";
import { fileTypeFromBuffer } from 'file-type';

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function createOneUser(req, res) {
  const { username, password } = req.body;
  const usernameRegex = /^[a-zA-Z0-9]+$/;
  const passwordRegex = /^[a-zA-Z0-9]+$/;

  if (!usernameRegex.test(username)) {
    return res.status(400).json({ message: 'Username can only contain letters and numbers.' });
  }
  if (!passwordRegex.test(password)) {
    return res.status(400).json({ message: 'Password can only contain letters and numbers.' });
  }

  const authenticatedUser = req.session.username;
  if (authenticatedUser) {
    return res.status(403).json({ message: 'You are already logged in. Authenticated user cannot create new users.' });
  }
  
  const existingUser = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  // 如果username已存在，返回錯誤訊息
  if (existingUser) {
    return res.status(400).json({ message: 'Username already exists.' });
  }
  const user = await prisma.user.create({
    data: {
      username: username,
      password: password,
      avatar: "data:image/jpeg;base64,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"
    },
  });
  return res.status(201).json(user);
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getOneUser(req, res) {
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
export async function uploadAvatar(req, res) {
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


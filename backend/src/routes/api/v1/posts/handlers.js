import { prisma } from "../../../../adapters.js";
import DOMPurify from "dompurify";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getAllMessages(req, res) {
    try {
        const messages = await prisma.message.findMany({
           include: {
                author: {
                    select: {
                        username: true,
                        avatar: true
                    }
                } 
           }
        });
        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Could not fetch messages" });
    }
}

export async function poMessage(req, res) {
   try {
      const { content } = req.body;
      const username = req.session.username; // 从会话中获取用户ID
      if (!username) {
        return res.status(401).json({ error: "User not authenticated" });
      }
      
      const sanitizedContent = DOMPurify.sanitize(content);

      const user = await prisma.user.findUnique({ where: { username: username }, select: { id: true, username: true, avatar: true } }); // 查询用户信息
      if (!user) {
         return res.status(404).json({ error: "User not found" });
      }
      const createdMessage = await prisma.message.create({
        data: {
            sanitizedContent,
            author: {
               connect: { id: user.id } // 使用用戶ID作為留言作者
            }
        },
        include: {
            author: {
                select: {
                    username: true,
                    avatar: true
                }
            }
        }
      });
      res.status(201).json(createdMessage);
   } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ error: "Could not create message" });
   }
}

export async function delMessage(req, res) {
    try {
        const messageId = parseInt(req.params.id);
        const username = req.session.username; // 從會話中獲取當前用戶名稱
        if (!username) {
            return res.status(401).json({ error: "User not authenticated" });
        }

        const message = await prisma.message.findUnique({
            where: { id: messageId },
            include: { 
                author: {
                    select: {
                        username: true // 只返回使用者的username字段
                    }
                } 
            }
        });
        if (!message) {
            return res.status(404).json({ error: "Message not found" });
        }
        if (message.author.username !== username) {
            return res.status(403).json({ error: "You are not authorized to delete this message" });
        }
        await prisma.message.delete({
            where: { id: messageId }
        });
        res.status(204).end();
    } catch (error) {
        console.error("Error deleting message:", error);
        res.status(500).json({ error: "Could not delete message" });
    }
}
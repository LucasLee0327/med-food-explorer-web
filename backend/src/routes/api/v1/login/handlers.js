import { prisma } from "../../../../adapters.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function loginCheck(req, res) {
    const { username, password } = req.body;

    if (req.session.username && req.session.isLoggedIn) {
      return res.status(403).json({ message: 'You are already logged in.' });
    }
  
    // 在資料庫中查找與提供的帳號相匹配的用戶
    const user = await prisma.user.findFirst({ where: { username: username } });
  
    // 如果找到用戶，則驗證密碼是否正確
    if (user && user.password === password) {
      // 登入成功，返回用戶資料
      req.session.username = username;
      req.session.isLoggedIn = true;

      return res.status(200).json({ isLoggedIn: true });
    } else {
      // 登入失敗，返回錯誤訊息
      return res.status(401).json({ isLoggedIn: false });
    }
 
}

export async function logoutCheck(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error("登出時發生錯誤：", err);
      return res.status(500).json({ isLoggedIn: true });
    } else {
      // 登出成功，重定向到首頁或其他目標頁面
      return res.status(200).json({ isLoggedIn: false });
    }
  });
}
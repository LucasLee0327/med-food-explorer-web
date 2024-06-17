import { prisma } from "../../../../adapters.js";

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function statusCheck(req, res) {
  if (req.session.isLoggedIn && req.session.username) {
    return res.status(200).json({ sessionStatus: true });
  } else {
    // 登入失敗，返回錯誤訊息
    return res.status(401).json({ sessionStatus: false });
  }
}

/**
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
export async function getUsername(req, res) {
  if (req.session.username) {
    return res.status(200).json({ Username: req.session.username });
  } else {
    // 登入失敗，返回錯誤訊息
    return res.status(401).json({ error: "User not authenticated" });
  }
}
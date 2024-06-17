import { Router } from "express";
import { getOneUser, createOneUser, uploadAvatar } from "./handlers.js";

const router = Router();
router.post('/', createOneUser);
router.get('/profile', getOneUser);
router.post('/profile', uploadAvatar);
export default router;

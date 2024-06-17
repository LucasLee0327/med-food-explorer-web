import { Router } from "express";
import { loginCheck, logoutCheck } from "./handlers.js";

const router = Router();
router.post('/', loginCheck);
router.post('/logout', logoutCheck);
export default router;
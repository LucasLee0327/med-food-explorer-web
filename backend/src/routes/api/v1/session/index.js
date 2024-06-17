import { Router } from "express";
import { statusCheck, getUsername } from "./handlers.js";

const router = Router();
router.get('/', statusCheck);
router.get('/username', getUsername);
export default router;
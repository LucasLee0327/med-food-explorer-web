import { Router } from "express";
import { poMessageToChatGPT } from "./handlers.js";

const router = Router();
router.post('/', poMessageToChatGPT);
export default router;
import { Router } from "express";
import { getAllMessages, poMessage, delMessage } from "./handlers.js";

const router = Router();
router.get('/', getAllMessages);
router.post('/', poMessage);
router.delete('/:id', delMessage);
export default router;
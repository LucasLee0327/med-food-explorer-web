import { Router } from "express";
import { getCsrfToken } from "./handlers.js";

const router = Router();
router.get('/', getCsrfToken);
export default router;

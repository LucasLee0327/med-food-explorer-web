import { Router } from "express";
import { getAllRestaurant, createRestaurant, drawRestaurants } from "./handlers.js";

const router = Router();
router.get('/', getAllRestaurant);
router.post('/', createRestaurant);
router.get('/draw', drawRestaurants);
export default router;

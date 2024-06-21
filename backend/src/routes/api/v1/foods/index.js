import { Router } from "express";
import { getAllRestaurant, createRestaurant, drawRestaurants, getRestaurant, uploadPic } from "./handlers.js";

const router = Router();
router.get('/', getAllRestaurant);
router.post('/', createRestaurant);
router.get('/draw', drawRestaurants);
router.get('/profile', getRestaurant);
router.post('/profile', uploadPic);
export default router;

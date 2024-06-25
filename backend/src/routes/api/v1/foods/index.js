import { Router } from "express";
import { getAllRestaurant, createRestaurant, drawRestaurants, createCandidate, getCandidates } from "./handlers.js";

const router = Router();
router.get('/', getAllRestaurant);
router.post('/', createRestaurant);
router.get('/draw', drawRestaurants);
router.get('/candidates', getCandidates);
router.post('/candidates', createCandidate);
export default router;

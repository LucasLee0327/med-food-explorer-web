import { Router } from "express";
import { getAllRestaurant, createRestaurant, drawRestaurants, createCandidate, getCandidates, deleteCandidate } from "./handlers.js";

const router = Router();
router.get('/', getAllRestaurant);
router.post('/', createRestaurant);
router.get('/draw', drawRestaurants);
router.get('/candidates', getCandidates);
router.post('/candidates', createCandidate);
router.delete('/candidates:id', deleteCandidate);
export default router;

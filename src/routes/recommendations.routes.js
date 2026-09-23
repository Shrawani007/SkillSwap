import express from 'express';
import { getRecommendations } from '../controllers/recommendations.controller.js';
import { verifyJWT } from '../middlewares/auth.middleware.js';

export const router=express.Router();
router.get("/",verifyJWT,getRecommendations);
export default router;
import express from "express";
import { getAllSkills } from "../controllers/skill.controller.js";

const router = express.Router();
router.get("/", getAllSkills);  
export default router;
import express from "express";
import { createRequest, getRequests, acceptRequest, rejectRequest } from "../controllers/requests.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);
router.post("/", createRequest);
router.get("/", getRequests);
router.patch("/accept/:id", acceptRequest);
router.patch("/reject/:id", rejectRequest);

export default router;
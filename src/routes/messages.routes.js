import express from "express";
import { saveMessage, getMessages } from "../controllers/message.controller.js";

const router = express.Router();

router.post("/", saveMessage);
router.get("/:senderId/:receiverId", getMessages);

export default router;
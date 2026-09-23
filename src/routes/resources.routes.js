import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createResource,
  getAllResources,
  updateResource,
  deleteResource,
  getOwnerResourcesBySkill,
  uploadFileToMinio,
  viewResource
} from "../controllers/resources.controller.js";
import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

router.post("/", verifyJWT, createResource);
router.get("/", verifyJWT, getAllResources);
router.get("/owner/:ownerId", verifyJWT, getOwnerResourcesBySkill);
router.put("/:id", verifyJWT, updateResource);
router.delete("/:id", verifyJWT, deleteResource);
router.post("/upload", verifyJWT, upload.array("files",10), uploadFileToMinio);

router.get("/view/:id", viewResource);

export default router;
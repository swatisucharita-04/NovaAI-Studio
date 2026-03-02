import express from "express";
import {
  getUserCreations,
  getPublishedCreations,
  toggleLikeCreation,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/creations", getUserCreations);
router.get("/published-creations", getPublishedCreations);
router.post("/toggle-like", toggleLikeCreation);

export default router;

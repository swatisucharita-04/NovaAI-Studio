import express from "express";
import {
  generateArticle,
  generateBlockTitle,
  generateImageFromText,
  removeImageBackground,
  removeImageObject,
  reviewResume,
} from "../controllers/aiController.js";
import { upload } from "../configs/multer.js";
import { authMiddleware } from "../middlewares/auth.js";

const router = express.Router();

router.post("/generate-article", generateArticle);
router.post("/generate-block-title", generateBlockTitle);
router.post("/text-to-image", generateImageFromText);
router.post("/generate-image", generateImageFromText);
router.post("/remove-background", authMiddleware, upload.single("image"), removeImageBackground);
router.post("/remove-object", authMiddleware, upload.single("image"), removeImageObject);
router.post("/review-resume", authMiddleware, upload.single("resume"), reviewResume);

export default router;
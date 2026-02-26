import { GoogleGenerativeAI } from "@google/generative-ai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const generateArticle = async (req, res) => {
  try {
    const auth = req.auth?.();
    const userId = auth?.userId || "dev-user";

    const { prompt, length } = req.body;
    const plan = req.plan || "free";
    const free_usage = req.free_usage || 0;

    if (!prompt || !length) {
      return res.status(400).json({
        success: false,
        message: "prompt and length are required",
      });
    }

    if (plan !== "premium" && free_usage >= 10) {
      return res.json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(prompt);
    const content = result.response.text();

    await sql`INSERT INTO Creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')`;

    if (plan !== "premium" && userId !== "dev-user") {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    return res.status(200).json({
      success: true,
      content,
    });

  } catch (error) {
    console.error("Generate error:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "AI generation failed",
    });
  }
};
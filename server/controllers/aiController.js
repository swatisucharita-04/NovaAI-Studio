import { GoogleGenAI } from "@google/genai";
import { v2 as cloudinary } from "cloudinary";
import sql from "../configs/db.js";
import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

//Lazy wrapper — fixes ESM/CJS conflict with pdf-parse
const pdfParse = (...args) => {
  const mod = require("pdf-parse");
  const fn = mod.default ?? mod;
  return fn(...args);
};

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

function getTextFromResponse(response) {
  if (response?.text) return response.text;

  if (
    response?.candidates &&
    response.candidates.length > 0 &&
    response.candidates[0]?.content?.parts
  ) {
    return response.candidates[0].content.parts
      .map((part) => part.text || "")
      .join("");
  }

  return "";
}

export const generateArticle = async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "prompt is required. Send JSON body: { \"prompt\": \"your topic or instruction\" }",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const content = getTextFromResponse(response);
    if (!content?.trim()) {
      return res.status(500).json({
        success: false,
        message: "AI returned empty content",
      });
    }

    const userId = req.userId ?? "anonymous";
    try {
      await sql`
        INSERT INTO public.creations (user_id, prompt, content, type)
        VALUES (${userId}, ${prompt}, ${content}, 'article')
      `;
    } catch (dbError) {
      console.error("Database insert failed:", dbError?.message ?? dbError);
      return res.status(500).json({
        success: false,
        message: "Failed to save creation",
        debug: process.env.NODE_ENV !== "production" ? dbError?.message : undefined,
      });
    }

    return res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("AI Error:", error?.message ?? JSON.stringify(error));
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateBlockTitle = async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "prompt is required. Send JSON body: { \"prompt\": \"...\" }",
      });
    }

    const userId = req.userId ?? "anonymous";
    const plan = req.plan ?? "free";
    const freeUsage = req.free_usage ?? 0;

    if (plan !== "premium" && freeUsage > 10) {
      return res.status(403).json({
        success: false,
        message: "Limit reached. Upgrade to continue.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        maxOutputTokens: 800,
        temperature: 0.5,
      },
    });

    const content = getTextFromResponse(response);
    if (!content?.trim()) {
      return res.status(500).json({ success: false, message: "AI returned empty content" });
    }

    await sql`
      INSERT INTO public.creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content.trim()}, 'block_title')
    `;

    return res.status(200).json({ success: true, content: content.trim() });
  } catch (error) {
    console.error("Block title error:", error?.message ?? JSON.stringify(error));
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const generateImageFromText = async (req, res) => {
  try {
    const prompt = req.body?.prompt;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: 'prompt is required. Send JSON body: { "prompt": "description of the image (max 1000 chars)" }',
      });
    }

    const userId = req.userId ?? "anonymous";
    const plan = req.plan ?? "free";
    const freeUsage = req.free_usage ?? 0;

    if (plan !== "premium" && freeUsage > 10) {
      return res.status(403).json({ success: false, message: "Limit reached. Upgrade to continue." });
    }

    const apiKey = process.env.CLIPDROP_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "CLIPDROP_API_KEY is not set in the server .env file." });
    }

    const form = new FormData();
    form.append("prompt", prompt.slice(0, 1000));

    const clipdropResponse = await fetch("https://clipdrop-api.co/text-to-image/v1", {
      method: "POST",
      headers: { "x-api-key": apiKey },
      body: form,
    });

    const remainingCredits = clipdropResponse.headers.get("x-remaining-credits") ?? undefined;
    const consumedCredits = clipdropResponse.headers.get("x-credits-consumed") ?? undefined;

    if (!clipdropResponse.ok) {
      let errorJson;
      try { errorJson = await clipdropResponse.json(); } catch {}
      return res.status(clipdropResponse.status).json({
        success: false,
        error: errorJson?.error ?? clipdropResponse.statusText,
        status: clipdropResponse.status,
      });
    }

    const imageBuffer = Buffer.from(await clipdropResponse.arrayBuffer());
    const base64 = imageBuffer.toString("base64");
    const dataUri = `data:image/png;base64,${base64}`;

    const uploadResult = await cloudinary.uploader.upload(dataUri, { folder: "novaai-images" });
    const secureUrl = uploadResult.secure_url;

    await sql`
      INSERT INTO public.creations (user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${secureUrl}, 'image')
    `;

    if (remainingCredits) res.setHeader("x-remaining-credits", remainingCredits);
    if (consumedCredits) res.setHeader("x-credits-consumed", consumedCredits);

    return res.status(200).json({ success: true, content: secureUrl });
  } catch (error) {
    console.error("Text-to-image error:", error?.message ?? error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeImageBackground = async (req, res) => {
  try {
    const userId = req.userId;
    const { file } = req;

    if (!file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    const plan = req.plan;
    if (!plan || !plan.includes("premium")) {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "novaai-images",
      transformation: [{ effect: "background_removal" }],
    });

    const secureUrl = uploadResult.secure_url;

    await sql`
      INSERT INTO public.creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Remove background from image', ${secureUrl}, 'remove_background')
    `;

    return res.status(200).json({ success: true, content: secureUrl });
  } catch (error) {
    console.error("Remove background error:", error?.message ?? error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const removeImageObject = async (req, res) => {
  try {
    const userId = req.userId ?? "anonymous";
    const { file } = req;
    const object = req.body?.object;

    if (!file) {
      return res.status(400).json({ success: false, message: "Image file is required" });
    }

    if (!object || typeof object !== "string" || !object.trim()) {
      return res.status(400).json({ success: false, message: "Object description is required" });
    }

    const plan = req.plan ?? "free";
    if (!plan?.includes("premium")) {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    const uploadResult = await cloudinary.uploader.upload(file.path, {
      folder: "novaai-images",
      eager: [{ effect: `gen_remove:prompt_${object.trim()}` }],
      eager_async: false,
    });

    const imageUrl = uploadResult.eager?.[0]?.secure_url ?? uploadResult.secure_url;

    await sql`
      INSERT INTO public.creations (user_id, prompt, content, type)
      VALUES (${userId}, ${"Removed " + object + " from image"}, ${imageUrl}, 'remove_object')
    `;

    return res.status(200).json({ success: true, content: imageUrl });
  } catch (error) {
    console.error("Remove object error:", error?.message ?? error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const reviewResume = async (req, res) => {
  try {
    const userId = req.userId ?? "anonymous";
    const { file } = req;

    if (!file) {
      return res.status(400).json({ success: false, message: "Resume file is required" });
    }

    if (!req.plan || !req.plan.includes("premium")) {
      return res.status(403).json({
        success: false,
        message: "This feature is only available for premium users",
      });
    }

    if (file.size > 5 * 1024 * 1024) {
      return res.status(400).json({
        success: false,
        message: "Resume file size exceeds allowed size of 5 MB",
      });
    }

    const dataBuffer = fs.readFileSync(file.path);
    const pdfData = await pdfParse(dataBuffer);
    const resumeText = pdfData.text;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: "Could not extract text from resume",
      });
    }

    const prompt = `Please review this resume and provide constructive feedback. Focus on: 1) Formatting and structure, 2) Key strengths, 3) Areas for improvement, 4) Specific recommendations. Here is the resume:\n\n${resumeText}`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const content = getTextFromResponse(response);
    if (!content?.trim()) {
      return res.status(500).json({ success: false, message: "AI returned empty review" });
    }

    await sql`
      INSERT INTO public.creations (user_id, prompt, content, type)
      VALUES (${userId}, 'Resume review', ${content}, 'resume_review')
    `;

    return res.status(200).json({ success: true, content });
  } catch (error) {
    console.error("Resume review error:", error?.message ?? error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
import { verifyToken } from "@clerk/backend";
import sql from "../configs/db.js";

export const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No token",
      });
    }

    const token = authHeader.split(" ")[1];

    const payload = await verifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
      authorizedParties: [
        "http://localhost:5173",
        "http://localhost:3000",
      ],
    });

    req.userId = payload.sub;

    // ✅ Get plan directly from Clerk token — no DB needed
    const rawPlan = payload.pla ?? "free";  // e.g. "u:premium" or "free"
    req.plan = rawPlan.includes("premium") ? "premium" : "free";
    req.free_usage = 0;

    console.log("User plan:", req.plan); // should print "premium"

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
};
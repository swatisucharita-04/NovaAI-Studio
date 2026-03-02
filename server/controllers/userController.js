import sql from "../configs/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const userId = req.userId ?? "anonymous";

    const creations = await sql`
      SELECT * FROM public.creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    return res.status(200).json({
      success: true,
      creations,
    });
  } catch (error) {
    console.error("Get user creations error:", error?.message ?? error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getPublishedCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM public.creations
      WHERE type = 'image'
      ORDER BY created_at DESC
    `;

    const formatted = creations.map((c) => ({
      ...c,
      likes: Array.isArray(c.likes) ? c.likes.length : 0,
    }));

    return res.status(200).json({
      success: true,
      creations: formatted,
    });
  } catch (error) {
    console.error("Get published creations error:", error?.message ?? error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleLikeCreation = async (req, res) => {
  try {
    const userId = req.userId ?? "anonymous";
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Creation ID is required",
      });
    }

    const [creation] = await sql`
      SELECT * FROM public.creations WHERE id = ${id}
    `;

    if (!creation) {
      return res.status(404).json({
        success: false,
        message: "Creation not found",
      });
    }

    // likes is stored as text[] array in DB
    const currentLikes = Array.isArray(creation.likes) ? creation.likes : [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((u) => u !== userIdStr);
      message = "Creation Unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation Liked";
    }

    //Store as text[] array - matches YT version
    const formattedArray = `{${updatedLikes.join(",")}}`;

    await sql`
      UPDATE public.creations
      SET likes = ${formattedArray}::text[]
      WHERE id = ${id}
    `;

    return res.status(200).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error("Toggle like creation error:", error?.message ?? error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
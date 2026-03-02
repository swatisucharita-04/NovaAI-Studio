import axios from "axios";

// set global default (screenshot reference)
axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const API = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

// Add auth token to requests if available
// Note: Clerk tokens are obtained via getToken() and passed manually to helpers below.
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && !config.headers.Authorization) {
    // only attach if not already provided
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// AI APIs
function withAuth(config = {}, token) {
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}

export const generateArticle = (prompt, token) =>
  API.post("/api/ai/generate-article", { prompt }, withAuth({}, token));

export const generateBlockTitle = (prompt, token) =>
  API.post("/api/ai/generate-block-title", { prompt }, withAuth({}, token));

export const generateImage = (payload, token) =>
  API.post("/api/ai/text-to-image", payload, withAuth({}, token));

// ✅ No Content-Type — axios auto-sets multipart/form-data with correct boundary
export const removeImageBackground = (formData, token) =>
  API.post(
    "/api/ai/remove-background",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const removeImageObject = (formData, object, token) =>
  API.post(
    "/api/ai/remove-object",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

export const reviewResume = (formData, token) =>
  API.post(
    "/api/ai/review-resume",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

// User APIs
export const getUserCreations = (token) =>
  API.get("/api/user/creations", withAuth({}, token));

export const getPublishedCreations = (token) =>
  API.get("/api/user/published-creations", withAuth({}, token));

export const toggleLikeCreation = (creationId, token) =>
  API.post(
    "/api/user/toggle-like",
    { id: creationId },
    withAuth({}, token)
  );

export default API;
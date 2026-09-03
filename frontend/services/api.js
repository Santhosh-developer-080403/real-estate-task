// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:5000",
// });

// // Request Interceptor to attach JWT token automatically
// API.interceptors.request.use((req) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     req.headers.Authorization = `Bearer ${token}`;
//   }
//   return req;
// });

// export default API;

import axios from "axios";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const getImageUrl = (imgPath) => {
  if (!imgPath) return "/placeholder.jpg";

  return `${API_URL}${imgPath.startsWith("/") ? "" : "/"}${imgPath}`;
};

const API = axios.create({
  baseURL: API_URL,
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

export default API;
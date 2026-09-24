const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1").replace(/\/$/, "");

const ACCESS_TOKEN_KEY = "aluguel360.access_token";
const REFRESH_TOKEN_KEY = "aluguel360.refresh_token";

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens({ access_token, refresh_token }) {
  if (access_token) localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
  if (refresh_token) localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem("aluguel360.user");
}

function getErrorMessage(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload.detail) return payload.detail;
  if (payload.error) return typeof payload.error === "string" ? payload.error : JSON.stringify(payload.error);
  if (payload.message) return payload.message;
  const first = Object.values(payload).flat(Infinity).find((value) => typeof value === "string");
  return first || fallback;
}

async function parseResponse(response) {
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(getErrorMessage(payload, `Erro HTTP ${response.status}`));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return payload?.data ?? payload;
}

async function refreshAccessToken() {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return false;
  const response = await fetch(`${API_URL}/auth/token/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token }),
  });
  if (!response.ok) {
    clearTokens();
    return false;
  }
  const data = await parseResponse(response);
  setTokens({ access_token: data.access_token || data.access });
  return true;
}

export async function apiFetch(path, options = {}, retry = true) {
  const { body, headers = {}, ...rest } = options;
  const isFormData = body instanceof FormData;
  const requestHeaders = { ...headers };
  if (!isFormData && body !== undefined) requestHeaders["Content-Type"] = "application/json";
  const token = getAccessToken();
  if (token) requestHeaders.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path.startsWith("/") ? path : `/${path}`}`, {
    ...rest,
    headers: requestHeaders,
    body: isFormData || typeof body === "string" ? body : body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401 && retry && await refreshAccessToken()) {
    return apiFetch(path, options, false);
  }
  return parseResponse(response);
}

export const api = {
  get: (path, options) => apiFetch(path, { ...options, method: "GET" }),
  post: (path, body, options) => apiFetch(path, { ...options, method: "POST", body }),
  patch: (path, body, options) => apiFetch(path, { ...options, method: "PATCH", body }),
  put: (path, body, options) => apiFetch(path, { ...options, method: "PUT", body }),
  delete: (path, options) => apiFetch(path, { ...options, method: "DELETE" }),
};

export { API_URL };

export function rememberUser(user) {
  if (user) localStorage.setItem("aluguel360.user", JSON.stringify(user));
}

export function getRememberedUser() {
  try {
    return JSON.parse(localStorage.getItem("aluguel360.user")) || null;
  } catch {
    return null;
  }
}

export function normalizeApiList(payload) {
  if (Array.isArray(payload)) return payload;
  return payload?.results || payload?.items || payload?.data || [];
}

export function toApiError(error) {
  return error?.message || "Não foi possível concluir a operação. Tente novamente.";
}

export async function logoutRequest() {
  const refresh_token = getRefreshToken();
  try {
    if (refresh_token) await api.post("/auth/logout/", { refresh_token });
  } finally {
    clearTokens();
  }
}

export async function registerUser(payload) {
  const data = await api.post("/auth/register/", payload);
  setTokens(data);
  rememberUser(data.user);
  return data;
}

export async function loginUser(email, senha) {
  const data = await api.post("/auth/login/", { email, senha });
  setTokens(data);
  rememberUser(data.user);
  return data;
}

export const authApi = {
  me: () => api.get("/users/me/"),
  register: registerUser,
  login: loginUser,
  logout: logoutRequest,
  forgotPassword: (email) => api.post("/auth/forgot-password/", { email }),
  verifyOtp: (email, codigo) => api.post("/auth/verify-otp/", { email, codigo }),
  resetPassword: (payload) => api.post("/auth/reset-password/", payload),
};

export const userApi = {
  me: () => api.get("/users/me/"),
  updateMe: (payload) => api.patch("/users/me/", payload),
  addresses: () => api.get("/users/me/addresses/"),
  stats: () => api.get("/users/me/stats/"),
};

export const listingApi = {
  list: (query = "") => api.get(`/listings/${query ? `?${query}` : ""}`),
  search: (query = "") => api.get(`/search/${query ? `?${query}` : ""}`),
};

export const propertyApi = {
  list: () => api.get("/properties/"),
  create: (payload) => api.post("/properties/", payload),
};

export const mediaApi = {
  list: () => api.get("/media/"),
  upload: (formData) => api.post("/media/", formData),
  remove: (id) => api.delete(`/media/${id}/`),
};

export const notificationApi = {
  list: () => api.get("/notifications/"),
};

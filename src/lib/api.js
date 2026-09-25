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

function unwrapApiData(payload) {
  let current = payload;
  for (let depth = 0; depth < 4; depth += 1) {
    if (!current || typeof current !== "object" || current.success !== true || !("data" in current)) return current;
    current = current.data;
  }
  return current;
}

async function parseResponse(response) {
  const payload = response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const error = new Error(getErrorMessage(payload, `Erro HTTP ${response.status}`));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }
  return unwrapApiData(payload);
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

  const requestUrl = /^https?:\/\//i.test(path)
    ? path
    : `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const response = await fetch(requestUrl, {
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
  return normalizeApiPage(payload).results;
}

export function normalizeApiPage(payload) {
  let current = payload;
  for (let depth = 0; depth < 4; depth += 1) {
    if (Array.isArray(current)) return { results: current, next: null, previous: null };
    if (!current || typeof current !== "object") return { results: [], next: null, previous: null };
    if (Array.isArray(current.results)) {
      return { results: current.results, next: current.next || null, previous: current.previous || null };
    }
    current = current.data || current.items;
  }
  return { results: [], next: null, previous: null };
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
  createAddress: (payload) => api.post("/users/me/addresses/", payload),
  updateAddress: (id, payload) => api.patch(`/users/me/addresses/${id}/`, payload),
  deleteAddress: (id) => api.delete(`/users/me/addresses/${id}/`),
  stats: () => api.get("/users/me/stats/"),
};

export const listingApi = {
  list: (query = "") => api.get(`/listings/${query ? `?${query}` : ""}`),
  listUrl: (url) => api.get(url),
  detail: (id) => api.get(`/listings/${id}/`),
  search: (query = "") => api.get(`/search/${query ? `?${query}` : ""}`),
  mine: (query = "") => api.get(`/listings/mine/${query ? `?${query}` : ""}`),
  publish: (id) => {
    if (!id) throw new Error("Anúncio sem identificador.");
    return api.post(`/listings/${id}/publish/`, {});
  },
  pause: (id) => {
    if (!id) throw new Error("Anúncio sem identificador.");
    return api.post(`/listings/${id}/pause/`, {});
  },
  remove: (id) => {
    if (!id) throw new Error("Anúncio sem identificador.");
    return api.delete(`/listings/${id}/`);
  },
  create: (payload) => api.post("/listings/", payload),
  update: (id, payload) => api.patch(`/listings/${id}/`, payload),
};

export const propertyApi = {
  list: () => api.get("/properties/"),
  create: (payload) => api.post("/properties/", payload),
  update: (id, payload) => api.patch(`/properties/${id}/`, payload),
  remove: (id) => api.delete(`/properties/${id}/`),
};

export const mediaApi = {
  list: () => api.get("/media/"),
  upload: (file, { tipo = "FOTO", propertyId, listingId, nome } = {}) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("tipo", tipo);
    if (propertyId) formData.append("property", propertyId);
    if (listingId) formData.append("listing", listingId);
    if (nome) formData.append("nome", nome);
    return api.post("/media/", formData);
  },
  remove: (id) => api.delete(`/media/${id}/`),
  quota: () => api.get("/media/quota/"),
};

export const notificationApi = {
  list: () => api.get("/notifications/"),
};

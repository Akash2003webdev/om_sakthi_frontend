// src/api.js — All API calls to Express backend (replaces supabase)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ─── Auth helpers ────────────────────────────────────────────
const getToken = () => sessionStorage.getItem("osp-token");
const authHeaders = () => ({ Authorization: `Bearer ${getToken()}` });

// ─── ADMIN AUTH ───────────────────────────────────────────────
export const adminLogin = async (password) => {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Login failed");
  sessionStorage.setItem("osp-token", data.token);
  return data;
};

export const adminLogout = () => {
  sessionStorage.removeItem("osp-token");
  sessionStorage.removeItem("osp-admin");
};

// ─── DESIGNS ─────────────────────────────────────────────────
export const fetchDesigns = async (category) => {
  const url = category ? `${BASE_URL}/designs?category=${category}` : `${BASE_URL}/designs`;
  const res = await fetch(url);
  const data = await res.json();
  return data.map((d) => ({
    id: d._id,
    title: d.title,
    category: d.category,
    tag: d.tag,
    image: d.image,
    images: d.images,
    description: d.description,
    details: { finish: d.finish, size: d.size, minQty: d.min_qty, delivery: d.delivery },
  }));
};

export const fetchDesignById = async (id) => {
  const res = await fetch(`${BASE_URL}/designs/${id}`);
  if (!res.ok) throw new Error("Design not found");
  const d = await res.json();
  return {
    id: d._id, title: d.title, category: d.category, tag: d.tag,
    image: d.image, images: d.images, description: d.description,
    details: { finish: d.finish, size: d.size, minQty: d.min_qty, delivery: d.delivery },
  };
};

// Admin: Create design (FormData with optional image files)
export const createDesign = async (formData) => {
  const res = await fetch(`${BASE_URL}/designs`, {
    method: "POST", headers: authHeaders(), body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Create failed");
  return data;
};

// Admin: Update design
export const updateDesign = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/designs/${id}`, {
    method: "PUT", headers: authHeaders(), body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
};

// Admin: Delete design
export const deleteDesign = async (id) => {
  const res = await fetch(`${BASE_URL}/designs/${id}`, {
    method: "DELETE", headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
};

// Admin: Upload single image → returns URL
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch(`${BASE_URL}/designs/upload-image`, {
    method: "POST", headers: authHeaders(), body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url;
};

// ─── CATEGORIES ───────────────────────────────────────────────
export const fetchCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories`);
  const data = await res.json();
  return data.map((c) => ({ id: c._id, label: c.label }));
};

export const createCategory = async ({ id, label }) => {
  const res = await fetch(`${BASE_URL}/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ id, label }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Create failed");
  return data;
};

export const updateCategory = async (id, label) => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ label }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
};

export const deleteCategory = async (id) => {
  const res = await fetch(`${BASE_URL}/categories/${id}`, {
    method: "DELETE", headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
};

// ─── SERVICES ─────────────────────────────────────────────────
export const fetchServices = async () => {
  const res = await fetch(`${BASE_URL}/services`);
  return res.json();
};

export const createService = async (payload) => {
  const res = await fetch(`${BASE_URL}/services`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Create failed");
  return data;
};

export const updateService = async (id, payload) => {
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Update failed");
  return data;
};

export const deleteService = async (id) => {
  const res = await fetch(`${BASE_URL}/services/${id}`, {
    method: "DELETE", headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
};

// ─── ENQUIRIES ────────────────────────────────────────────────
// Public: submit enquiry from any page
export const submitEnquiry = async ({ name, phone, message, designId }) => {
  const res = await fetch(`${BASE_URL}/enquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, phone, message, designId }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Submit failed");
  return data;
};

// Admin: fetch all enquiries
export const fetchEnquiries = async () => {
  const res = await fetch(`${BASE_URL}/enquiries`, { headers: authHeaders() });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Fetch failed");
  return data.map((e) => ({ ...e, id: e._id }));
};

// Admin: delete enquiry
export const deleteEnquiry = async (id) => {
  const res = await fetch(`${BASE_URL}/enquiries/${id}`, {
    method: "DELETE", headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Delete failed");
  return data;
};

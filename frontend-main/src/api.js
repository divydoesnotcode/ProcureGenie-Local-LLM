// src/api.js — replace your existing api.js with this
const BASE_URL = "/api/v1";

export async function getAllVendors() {
  const response = await fetch(`${BASE_URL}/vendors/`);
  if (!response.ok) throw new Error("Failed to fetch vendors");
  return response.json();
}

export async function generateVendors(item, location) {
  const response = await fetch(`${BASE_URL}/vendors/generate-vendors-flow`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ item, location }),
  });
  if (!response.ok) throw new Error("Failed to generate vendors");
  return response.json();
}

/**
 * Send a chat message and get a reply + vendors
 * @param {string} message - user's natural language message
 * @param {Array}  history - [{role: "user"|"assistant", content: "..."}]
 */
export async function sendChatMessage(message, history = []) {
  const response = await fetch(`${BASE_URL}/chat/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!response.ok) throw new Error("Chat request failed");
  return response.json(); // { reply, vendors, source }
}
// utils/generateId.js

// Generate unique 16-character order ID
function generateCustomOrderId({ userName, email, phone, fullAddress }) {
  const prefix = "ORD";
  const year = new Date().getFullYear().toString().slice(-2); // last 2 digits of year

  const unamePart = (userName || "XX").substring(0, 2).toUpperCase();
  let emailPart = "XX";
  if (email && email.includes("@")) {
    emailPart = email.split("@")[0].substring(0, 2).toUpperCase();
  }

  const phonePart = (phone || "0000").slice(-4);
  const addressPart = (fullAddress || "XX").substring(0, 2).toUpperCase();

  let orderId = `${prefix}${year}${unamePart}${emailPart}${phonePart}${addressPart}`;

  // Pad with random letters/numbers to make exactly 16 chars
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  while (orderId.length < 16) {
    orderId += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return orderId.slice(0, 16); // ensure exactly 16 chars
}

// Generate unique product item ID (8 chars + ITEM- prefix)
function generateProductItemId() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let id = "ITEM-";
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

// Export as module
module.exports = { generateCustomOrderId, generateProductItemId };

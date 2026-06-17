const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

app.post("/api/orders", (req, res) => {
  const { name, service, notes, cart } = req.body;

  if (!name || !service || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: "Name, service, and cart are required." });
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.unitPrice || 0) * (item.qty || 0), 0);
  const tax = Number((subtotal * 0.08).toFixed(2));
  const total = Number((subtotal + tax).toFixed(2));

  const order = {
    id: Date.now(),
    name,
    service,
    notes: notes || "",
    cart,
    subtotal,
    tax,
    total,
    createdAt: new Date().toISOString(),
  };

  console.log("Received new order:", order);

  return res.status(201).json({ message: "Order placed successfully.", order });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

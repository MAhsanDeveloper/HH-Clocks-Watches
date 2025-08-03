
import express from "express";
import Order from "../models/order.model.js";
import { generateInvoice } from "../utils/generateInvoice.js";
import { generatePackagingSlip } from "../utils/generatePackageSlip.js";


const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { name, phone, email, address, paymentMethod, notes, cartItems } = req.body;

    if (!name || !phone || !address || !paymentMethod || !cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: "Invalid order data" });
    }

    const total = cartItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const order = new Order({
      customerName: name,
      customerPhone: phone,
      customerEmail: email,
      address,
      notes,
      items: cartItems.map((item) => ({
        productId: item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      totalAmount: total,
    });

    await order.save();
    res.status(201).json({ message: "Order placed successfully" });
  } catch (error) {
    console.error("Order error:", error);
    res.status(500).json({ message: "Failed to place order" });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

router.get("/:id/invoice", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=invoice-${order._id}.pdf`);

    generateInvoice(order, res); // Pipe PDF directly to response
  } catch (error) {
    console.error("Failed to generate invoice:", error);
    res.status(500).json({ message: "Error generating invoice" });
  }
});

router.get("/:id/packaging-slip", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=packaging-slip-${order._id}.pdf`);

    generatePackagingSlip(order, res); // Pipe PDF directly to response
  } catch (error) {
    console.error("Failed to generate packaging slip:", error);
    res.status(500).json({ message: "Error generating packaging slip" });
  }
});


export default router;

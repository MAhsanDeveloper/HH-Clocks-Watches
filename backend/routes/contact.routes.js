import express from "express";
import Contact from "../models/contact.model.js";
import protectAdmin from "../middleware/protectRoute.js";

const router = express.Router();

// GET (public)
router.get("/", async (req, res) => {
  const contact = await Contact.findOne();
  res.json(contact);
});

// PUT (admin-only)
router.put("/", protectAdmin, async (req, res) => {
  const data = req.body;
  let contact = await Contact.findOne();
  if (contact) {
    contact.set(data);
    await contact.save();
  } else {
    contact = await Contact.create(data);
  }
  res.json(contact);
});

export default router;

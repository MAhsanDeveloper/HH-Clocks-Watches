import express from "express";
import Shop from "../models/shop.model.js";

import multer from "multer";
import path from "path";
import fs from "fs";
import protectAdmin from "../middleware/protectRoute.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/shop";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = file.originalname.split(ext)[0].replace(/\s+/g, "-");
    cb(null, `${name}-${Date.now()}${ext}`);
  },
});

const upload = multer({ storage });

//  Public route - GET all items
router.get("/", async (req, res) => {
  try {
    const items = await Shop.find();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch items" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const item = await Shop.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch item" });
  }
});



//  Protected routes
router.post("/", protectAdmin, upload.fields([
  { name: "mainImage", maxCount: 1 },
  { name: "previewImages", maxCount: 3 },
]), async (req, res) => {
  try {
    const files = req.files;
    const mainImage = files?.mainImage?.[0]?.path.replace(/\\/g, "/");
    const previewImages = files?.previewImages?.map((f) => f.path.replace(/\\/g, "/")) || [];

const newItem = new Shop({
  name: req.body.name,
  price: req.body.price,
  model: req.body.model,
  description: req.body.description,
  mainImage: mainImage ? "/" + mainImage : "",
  previewImages: previewImages.map((img) => "/" + img),
  hasDiscount: req.body.hasDiscount === "true",
  discountRate: Number(req.body.discountRate) || 0,
  available: Number(req.body.available) || 0,
  sold: 0,
  inStock: Number(req.body.available) > 0,
});


    await newItem.save();
    res.json({ message: "Item added", item: newItem });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add item" });
  }
});


router.put("/:id", protectAdmin, async (req, res) => {
  try {
    if (req.body.available !== undefined) {
      req.body.inStock = Number(req.body.available) > 0;
    }

    const updated = await Shop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({ message: "Item updated", updated });
  } catch (err) {
    res.status(500).json({ error: "Failed to update item" });
  }
});


router.delete("/:id", protectAdmin, async (req, res) => {
  try {
    const item = await Shop.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Delete image file if exists
    if (item.image) {
      const imagePath = path.join("uploads", item.image);
      fs.unlink(imagePath, (err) => {
        if (err) console.error("Failed to delete image:", err);
      });
    }

    await Shop.findByIdAndDelete(req.params.id);
    res.json({ message: "Item deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete item" });
  }
});



export default router;

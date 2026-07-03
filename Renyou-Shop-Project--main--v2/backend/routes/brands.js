import express from "express";
import { Bundle } from "../models/Bundle.js";
import Brand from "../models/Brand.js";
import Product from "../models/Product.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

/* PUBLIC BRANDS */
router.get("/public/list", async (req, res) => {
  try {
    const brands = await Brand.find().sort({ name: 1 });

    const enriched = await Promise.all(
      brands.map(async (b) => {
        const count = await Product.countDocuments({
          brand: b._id,
          status: "ACTIVE",
        });

        return {
          ...b.toObject(),
          productCount: count,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ADMIN LIST */
router.get("/", auth, async (req, res) => {
  try {
    const { search, status } = req.query;

    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (status) {
      filter.status = status;
    }

    const brands = await Brand.find(filter).sort({ name: 1 });

    const enriched = await Promise.all(
      brands.map(async (b) => {
        const count = await Product.countDocuments({
          brand: b._id,
          status: "ACTIVE",
        });

        return {
          ...b.toObject(),
          productCount: count,
        };
      })
    );

    res.json(enriched);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* CREATE */
router.post("/", auth, async (req, res) => {
  try {
    const brand = await Brand.create(req.body);
    res.status(201).json(brand);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* UPDATE */
router.put("/:id", auth, async (req, res) => {
  try {
    const brand = await Brand.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    const count = await Product.countDocuments({
      brand: brand._id,
      status: "ACTIVE",
    });

    res.json({
      ...brand.toObject(),
      productCount: count,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* DELETE */
router.delete("/:id", auth, async (req, res) => {
  try {
    await Brand.findByIdAndDelete(req.params.id);

    res.json({
      message: "Brand deleted",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
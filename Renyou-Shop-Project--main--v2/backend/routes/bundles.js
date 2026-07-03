import express from "express";
import { Bundle } from "../models/Bundle.js";

const router = express.Router();

/* GET all bundles */
router.get("/", async (req, res) => {
  try {
    const bundles = await Bundle.find({
      active: true,
    }).populate("products");

    res.json(bundles);
  } catch (err) {
    res.status(500).json({
      error: err.message,
    });
  }
});

/* CREATE bundle */
router.post("/", async (req, res) => {
  try {
    const bundle = await Bundle.create(req.body);

    res.status(201).json(bundle);
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

/* GET one bundle */
router.get("/:id", async (req, res) => {
  try {
    const bundle = await Bundle.findById(req.params.id)
      .populate("products");

    if (!bundle) {
      return res.status(404).json({
        error: "Bundle not found"
      });
    }

    res.json(bundle);

  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

export default router;
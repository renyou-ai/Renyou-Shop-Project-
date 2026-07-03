import mongoose from "mongoose";
import dotenv from "dotenv";

import "../models/Product.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const Product = mongoose.model("Product");

const products = await Product.find({}, { tags: 1 });

const allTags = [
  ...new Set(
    products.flatMap((p) => p.tags || [])
  ),
].sort();

process.exit();
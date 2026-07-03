import mongoose from "mongoose";
import dotenv from "dotenv";

import "../models/Product.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const Product = mongoose.model("Product");

const products = await Product.find();

for (const product of products) {
  await product.save();
}

console.log("Done");

process.exit();
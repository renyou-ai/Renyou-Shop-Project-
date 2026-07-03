import mongoose from "mongoose";

const bundleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],

    salePrice: {
      type: Number,
      required: true,
    },

    image: String,

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Bundle = mongoose.model(
  "Bundle",
  bundleSchema
);
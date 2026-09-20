import { Schema, model, models } from "mongoose";

export const productAvailability = ["In stock", "Made to order", "Sold out"] as const;

const productSchema = new Schema(
  {
    id: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    availability: { type: String, required: true, enum: productAvailability },
    price: { type: Number, required: true, min: 0 },
    image: { type: String, required: true },
    images: { type: [String], required: true, default: [] },
    imageAlt: { type: String, required: true },
  },
  { versionKey: false },
);

export const Product = models.Product ?? model("Product", productSchema);

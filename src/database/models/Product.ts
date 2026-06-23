import { Schema, model, models, Model } from "mongoose";

// Shape of a Product document in the database.
export interface IProduct {
  sku: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  currency: "COP" | "USD";
}

const productSchema = new Schema<IProduct>(
  {
    // unique: database-level constraint so two products can't share a SKU.
    sku: { type: String, required: [true, "El SKU es requerido"], unique: true },
    name: { type: String, required: [true, "El nombre es requerido"] },
    category: { type: String, required: [true, "La categoría es requerida"] },
    // min keeps the price from being negative.
    price: { type: Number, required: [true, "El precio es requerido"], min: [0, "El precio no puede ser negativo"] },
    stock: {
      type: Number,
      required: [true, "El stock es requerido"],
      min: [0, "El stock no puede ser negativo"],
      // Stock must be a whole number (no half units).
      validate: { validator: Number.isInteger, message: "El stock debe ser un entero" },
    },
    // enum restricts currency to these two values.
    currency: { type: String, enum: ["COP", "USD"], default: "COP" },
  },
  // timestamps adds createdAt / updatedAt automatically.
  { timestamps: true }
);

// Reuse the compiled model on hot-reload to avoid OverwriteModelError.
const Product: Model<IProduct> =
  models.Product || model<IProduct>("Product", productSchema);

export default Product;

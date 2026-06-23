import type { QueryFilter } from "mongoose";
import connectDB from "@/lib/database";
import Product, { IProduct } from "@/database/models/Product";

// GET /api/products -> list products, optionally filtered by
// ?name=...&category=...&available=true|false
export async function GET(request: Request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name");
    const category = searchParams.get("category");
    const available = searchParams.get("available");

    // Typed filter (no `any`).
    const filter: QueryFilter<IProduct> = {};
    if (name) filter.name = { $regex: name, $options: "i" }; // partial, case-insensitive
    if (category) filter.category = { $regex: category, $options: "i" };
    if (available === "true") filter.stock = { $gt: 0 }; // in stock
    else if (available === "false") filter.stock = { $lte: 0 }; // out of stock

    const products = await Product.find(filter);
    return Response.json(
      { data: products, code: 200, message: "Productos obtenidos" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// POST /api/products -> create a product.
export async function POST(request: Request) {
  try {
    await connectDB();

    const { sku, name, category, price, stock, currency } =
      (await request.json()) as Partial<IProduct>;

    // 1) Required fields -> 400. price/stock can be 0, so check for null/undefined.
    if (!sku || !name || !category || price == null || stock == null) {
      return Response.json(
        { data: null, code: 400, message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // 2) Numeric rules -> 400.
    if (price < 0 || stock < 0) {
      return Response.json(
        { data: null, code: 400, message: "El precio y el stock no pueden ser negativos" },
        { status: 400 }
      );
    }
    if (!Number.isInteger(stock)) {
      return Response.json(
        { data: null, code: 400, message: "El stock debe ser un número entero" },
        { status: 400 }
      );
    }

    // 3) Duplicate SKU -> 409.
    const exists = await Product.findOne({ sku });
    if (exists) {
      return Response.json(
        { data: null, code: 409, message: "El SKU ya está registrado" },
        { status: 409 }
      );
    }

    const newProduct = await Product.create({
      sku,
      name,
      category,
      price,
      stock,
      currency: currency === "USD" ? "USD" : "COP",
    });

    return Response.json(
      { data: newProduct, code: 201, message: "Producto creado" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

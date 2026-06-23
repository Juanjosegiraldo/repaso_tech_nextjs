import connectDB from "@/lib/database";
import Product, { IProduct } from "@/database/models/Product";

// In Next 16, params is a Promise -> must be awaited.
type Context = { params: Promise<{ id: string }> };

// GET /api/products/:id -> a single product.
export async function GET(_request: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;

    const product = await Product.findById(id);
    if (!product) {
      return Response.json(
        { data: null, code: 404, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: product, code: 200, message: "Producto obtenido" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// PUT /api/products/:id -> update a product.
export async function PUT(request: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;

    const body = (await request.json()) as Partial<IProduct>;

    // Guard the numeric rules when those fields are present.
    if (body.price != null && body.price < 0) {
      return Response.json(
        { data: null, code: 400, message: "El precio no puede ser negativo" },
        { status: 400 }
      );
    }
    if (body.stock != null && (body.stock < 0 || !Number.isInteger(body.stock))) {
      return Response.json(
        { data: null, code: 400, message: "El stock debe ser un entero >= 0" },
        { status: 400 }
      );
    }

    const updated = await Product.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return Response.json(
        { data: null, code: 404, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: updated, code: 200, message: "Producto actualizado" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// DELETE /api/products/:id -> remove a product.
export async function DELETE(_request: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json(
        { data: null, code: 404, message: "Producto no encontrado" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: null, code: 200, message: "Producto eliminado" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

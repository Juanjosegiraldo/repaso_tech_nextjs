import connectDB from "@/lib/database";
import Comment from "@/database/models/Comment";

// In Next 16, params is a Promise -> must be awaited.
type Context = { params: Promise<{ id: string }> };

// GET /api/products/:id/comments -> comment history for a product (newest first).
export async function GET(_request: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;

    const comments = await Comment.find({ productId: id }).sort({ createdAt: -1 });
    return Response.json(
      { data: comments, code: 200, message: "Comentarios obtenidos" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// POST /api/products/:id/comments -> add a comment to a product.
export async function POST(request: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;

    const { content } = (await request.json()) as { content?: string };

    if (!content) {
      return Response.json(
        { data: null, code: 400, message: "El contenido es obligatorio" },
        { status: 400 }
      );
    }

    const comment = await Comment.create({ productId: id, content });
    return Response.json(
      { data: comment, code: 201, message: "Comentario agregado" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

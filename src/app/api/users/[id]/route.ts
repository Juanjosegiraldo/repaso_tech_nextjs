import bcrypt from "bcryptjs";
import connectDB from "@/lib/database";
import User, { IUser } from "@/database/models/User";

// In Next 16, params is a Promise -> must be awaited.
type Context = { params: Promise<{ id: string }> };

// PUT /api/users/:id -> update a user.
export async function PUT(request: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;

    const body = (await request.json()) as Partial<IUser>;

    // If the password is being updated, hash the new one too.
    if (body.password) {
      body.password = await bcrypt.hash(body.password, 10);
    }

    const updated = await User.findByIdAndUpdate(id, body, {
      new: true, // return the updated document
      runValidators: true, // enforce schema rules (enum, required) on update
    }).select("-password");

    if (!updated) {
      return Response.json(
        { data: null, code: 404, message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: updated, code: 200, message: "Usuario actualizado" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// DELETE /api/users/:id -> remove a user.
export async function DELETE(_request: Request, { params }: Context) {
  try {
    await connectDB();
    const { id } = await params;

    const deleted = await User.findByIdAndDelete(id);

    if (!deleted) {
      return Response.json(
        { data: null, code: 404, message: "Usuario no encontrado" },
        { status: 404 }
      );
    }

    return Response.json(
      { data: null, code: 200, message: "Usuario eliminado" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

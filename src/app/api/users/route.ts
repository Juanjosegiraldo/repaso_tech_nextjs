import bcrypt from "bcryptjs";
import connectDB from "@/lib/database";
import User, { IUser } from "@/database/models/User";

// GET /api/users -> list all users WITHOUT their password.
export async function GET() {
  try {
    await connectDB();
    // .select("-password") excludes the password field from the result.
    const users = await User.find({}).select("-password");
    return Response.json(
      { data: users, code: 200, message: "Usuarios obtenidos" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

// POST /api/users -> create a user.
export async function POST(request: Request) {
  try {
    await connectDB();

    // Cast the parsed body to the known shape (no `any`).
    const { nombre, cc, email, password, role } =
      (await request.json()) as Partial<IUser>;

    // 1) Required fields -> 400.
    if (!nombre || !cc || !email || !password) {
      return Response.json(
        { data: null, code: 400, message: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // 2) Duplicate email -> 409.
    const exists = await User.findOne({ email });
    if (exists) {
      return Response.json(
        { data: null, code: 409, message: "El email ya está registrado" },
        { status: 409 }
      );
    }

    // 3) Hash the password before saving (never store it in plain text).
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      nombre,
      cc,
      email,
      password: hashedPassword,
      role: role === "admin" ? "admin" : "user",
    });

    // 4) Re-read without the password to return a safe payload.
    const created = await User.findById(newUser._id).select("-password");

    return Response.json(
      { data: created, code: 201, message: "Usuario creado" },
      { status: 201 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

import bcrypt from "bcryptjs";
import connectDB from "@/lib/database";
import User, { IUser } from "@/database/models/User";

// POST /api/auth/login -> validate credentials and return session data.
export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = (await request.json()) as Partial<IUser>;

    // Required fields -> 400.
    if (!email || !password) {
      return Response.json(
        { data: null, code: 400, message: "Email y contraseña son obligatorios" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    // Generic 401 for both "user not found" and "wrong password"
    // so we don't reveal which emails exist.
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Response.json(
        { data: null, code: 401, message: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    // Return ONLY the safe session fields (never the password).
    const session = {
      nombre: user.nombre,
      email: user.email,
      role: user.role,
    };

    return Response.json(
      { data: session, code: 200, message: "Login exitoso" },
      { status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json({ data: null, code: 500, message }, { status: 500 });
  }
}

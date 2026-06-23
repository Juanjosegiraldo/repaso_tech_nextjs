import { Schema, model, models, Model } from "mongoose";

// Shape of a User document in the database.
export interface IUser {
  nombre: string;
  cc: string;
  email: string;
  password: string;
  role: "user" | "admin";
}

const userSchema = new Schema<IUser>(
  {
    nombre: { type: String, required: [true, "El nombre es requerido"] },
    cc: { type: String, required: [true, "La cédula es requerida"] },
    // unique: database-level constraint so two users can't share an email.
    email: { type: String, required: [true, "El email es requerido"], unique: true },
    password: { type: String, required: [true, "La contraseña es requerida"] },
    // enum restricts role to these two values; default applies when omitted.
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  // timestamps adds createdAt / updatedAt automatically.
  { timestamps: true }
);

// Reuse the compiled model on hot-reload to avoid OverwriteModelError.
const User: Model<IUser> = models.User || model<IUser>("User", userSchema);

export default User;

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/services/authService";
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  User,
} from "@/services/userService";
import { UserCard } from "@/components/UserCard";

// Empty form template.
const EMPTY_FORM: User = {
  nombre: "",
  cc: "",
  email: "",
  password: "",
  role: "user",
};

export default function AdminUsersPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [form, setForm] = useState<User>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Reload the list from the service.
  const loadUsers = () => {
    getUsers().then(setUsers).catch(() => setUsers([]));
  };

  // Auth + role guard, then initial load.
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
      return;
    }
    if (session.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    // Syncing client-only state (localStorage session) on mount is the intent here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllowed(true);
    loadUsers();
  }, [router]);

  // Update a single form field by key.
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Create or update depending on editingId.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        // Don't send an empty password on edit (keep the current one).
        const data: Partial<User> = {
          nombre: form.nombre,
          cc: form.cc,
          email: form.email,
          role: form.role,
        };
        if (form.password) data.password = form.password;
        await updateUser(editingId, data);
      } else {
        await createUser(form);
      }
      setForm(EMPTY_FORM);
      setEditingId(null);
      loadUsers(); // refresh the list
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  // Load a user into the form for editing.
  const handleEdit = (u: User) => {
    setForm({ ...u, password: "" }); // never prefill the password
    setEditingId(u._id ?? null);
  };

  // Delete and refresh.
  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await deleteUser(id);
      loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    }
  };

  const handleCancel = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  if (!allowed) return null;

  return (
    <main className="mx-auto max-w-2xl space-y-6 p-6">
      <h1 className="text-2xl font-bold">Administración de usuarios</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {/* Create / edit form */}
      <form onSubmit={handleSubmit} className="space-y-3 rounded-lg border p-4">
        <h2 className="font-semibold">
          {editingId ? "Editar usuario" : "Crear usuario"}
        </h2>
        <input
          name="nombre"
          placeholder="Nombre"
          value={form.nombre}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />
        <input
          name="cc"
          placeholder="Cédula"
          value={form.cc}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full rounded border p-2"
        />
        <input
          name="password"
          type="password"
          placeholder={editingId ? "Nueva contraseña (opcional)" : "Contraseña"}
          value={form.password ?? ""}
          onChange={handleChange}
          required={!editingId}
          className="w-full rounded border p-2"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full rounded border p-2"
        >
          <option value="user">user</option>
          <option value="admin">admin</option>
        </select>

        <div className="flex gap-2">
          <button
            type="submit"
            className="rounded bg-black px-4 py-2 text-white"
          >
            {editingId ? "Guardar cambios" : "Crear"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={handleCancel}
              className="rounded border px-4 py-2"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* User list */}
      {users.length === 0 ? (
        <p>No hay usuarios registrados. ¡Crea el primero!</p>
      ) : (
        <div className="space-y-3">
          {users.map((u) => (
            <UserCard
              key={u._id}
              nombre={u.nombre}
              cc={u.cc}
              email={u.email}
              role={u.role}
              onEdit={() => handleEdit(u)}
              onDelete={() => handleDelete(u._id ?? "")}
            />
          ))}
        </div>
      )}
    </main>
  );
}

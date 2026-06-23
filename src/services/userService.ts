// Service layer: the views NEVER call fetch directly, they go through here.
// If the transport (fetch/axios) or a route changes, we only touch this file.

// Client-facing shape. password is optional (never returned by the API on reads)
// and _id is added by Mongo.
export interface User {
  _id?: string;
  nombre: string;
  cc: string;
  email: string;
  password?: string;
  role: "user" | "admin";
}

const BASE_URL = "/api/users";

// GET /api/users -> list of users (without password).
export const getUsers = async (): Promise<User[]> => {
  const res = await fetch(BASE_URL);
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al obtener usuarios");
  return json.data ?? [];
};

// POST /api/users -> create a user.
export const createUser = async (userData: User): Promise<User> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al crear usuario");
  return json.data;
};

// PUT /api/users/:id -> update a user (partial fields).
export const updateUser = async (
  id: string,
  data: Partial<User>
): Promise<User> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al actualizar usuario");
  return json.data;
};

// DELETE /api/users/:id -> delete a user.
export const deleteUser = async (id: string): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error al eliminar usuario");
};

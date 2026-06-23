"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/services/authService";
import { getUsers, User } from "@/services/userService";

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const session = getSession();
    // 1) No session -> login.
    if (!session) {
      router.push("/login");
      return;
    }
    // 2) Logged in but not admin -> back to dashboard.
    if (session.role !== "admin") {
      router.push("/dashboard");
      return;
    }
    // 3) Admin: allow render and load the list.
    // Syncing client-only state (localStorage session) on mount is the intent here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAllowed(true);
    getUsers().then(setUsers).catch(() => setUsers([]));
  }, [router]);

  if (!allowed) return null;

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Administración de usuarios</h1>

      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((u) => (
            <li key={u._id} className="rounded border p-3">
              <strong>{u.nombre}</strong> — {u.email}{" "}
              <span className="text-sm text-gray-500">({u.role})</span>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

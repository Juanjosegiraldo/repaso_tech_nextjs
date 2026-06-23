"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, clearSession, SessionUser } from "@/services/authService";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  // Route guard: runs on the client after mount.
  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login"); // no session -> kick out
      return;
    }
    // Syncing client-only state (localStorage session) on mount is the intent here.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(session);
  }, [router]);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  // While the guard decides, render nothing to avoid a flash of content.
  if (!user) return null;

  return (
    <main className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>
        Bienvenido, <strong>{user.nombre}</strong> ({user.role})
      </p>

      {user.role === "admin" && (
        <a href="/admin/users" className="text-blue-600 underline">
          Ir a administración de usuarios
        </a>
      )}

      <button
        onClick={handleLogout}
        className="block rounded bg-red-600 px-4 py-2 text-white"
      >
        Cerrar sesión
      </button>
    </main>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession, SessionUser } from "@/services/authService";

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

  // While the guard decides, render nothing to avoid a flash of content.
  if (!user) return null;

  // Navigation (logout / sections) now lives in the shared Navbar.
  return (
    <main className="mx-auto max-w-2xl space-y-4 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p>
        Bienvenido, <strong>{user.nombre}</strong> ({user.role})
      </p>
      <p className="text-gray-600">
        Usa la barra superior para navegar entre Productos
        {user.role === "admin" ? ", Usuarios" : ""} o cerrar sesión.
      </p>
    </main>
  );
}

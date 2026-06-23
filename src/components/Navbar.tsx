"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSession, clearSession, SessionUser } from "@/services/authService";

// Shared top bar for every logged-in view.
// Rendered from the nested layouts (dashboard + admin).
export const Navbar = () => {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);

  useEffect(() => {
    // Read the session once on mount (client-only localStorage).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUser(getSession());
  }, []);

  const handleLogout = () => {
    clearSession();
    router.push("/login");
  };

  return (
    <header className="border-b bg-white">
      <nav className="mx-auto flex max-w-3xl items-center justify-between p-4">
        {/* Brand + section links */}
        <div className="flex items-center gap-4 text-sm">
          <Link href="/dashboard" className="font-bold">
            TechNova
          </Link>
          <Link href="/dashboard" className="text-gray-600 hover:underline">
            Dashboard
          </Link>
          <Link href="/dashboard/products" className="text-gray-600 hover:underline">
            Productos
          </Link>
          {/* Admin-only link */}
          {user?.role === "admin" && (
            <Link href="/admin/users" className="text-gray-600 hover:underline">
              Usuarios
            </Link>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => router.back()}
            className="rounded border px-3 py-1 text-sm"
          >
            Regresar
          </button>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-3 py-1 text-sm text-white"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  );
};

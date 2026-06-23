"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/services/authService";

// Entry point: decide the initial view based on the session.
// Logged in -> /dashboard, otherwise -> /login.
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    // replace() so the browser "back" button doesn't return to "/".
    router.replace(session ? "/dashboard" : "/login");
  }, [router]);

  return null; // nothing to show; we redirect immediately
}

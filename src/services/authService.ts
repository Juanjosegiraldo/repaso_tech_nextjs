// Auth service: login call + typed localStorage session helpers.
// Views use these instead of touching fetch / localStorage directly.

export interface SessionUser {
  nombre: string;
  email: string;
  role: "user" | "admin";
}

export interface LoginCredentials {
  email: string;
  password: string;
}

const SESSION_KEY = "user";

// POST /api/auth/login -> returns the session data or throws on 401.
export const login = async (
  credentials: LoginCredentials
): Promise<SessionUser> => {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || "Error de autenticación");
  return json.data;
};

// Save the session in localStorage (called after a successful login).
export const saveSession = (user: SessionUser): void => {
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
};

// Read the current session, or null if there is none.
export const getSession = (): SessionUser | null => {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? (JSON.parse(raw) as SessionUser) : null;
};

// Remove the session (logout).
export const clearSession = (): void => {
  localStorage.removeItem(SESSION_KEY);
};

import { Navbar } from "@/components/Navbar";

// Layout for every /admin route: shows the same shared Navbar.
export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

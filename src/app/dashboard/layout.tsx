import { Navbar } from "@/components/Navbar";

// Layout for every /dashboard route: shows the shared Navbar above the page.
export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setLoggingOut(false);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="border-b border-white/40 bg-white/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <h1 className="text-lg font-semibold">Admin Panel</h1>
          <nav className="flex items-center gap-4 text-sm">
            <Link
              href="/admin/products"
              className="text-muted-foreground hover:text-foreground"
            >
              Productos
            </Link>
            <Link
              href="/admin/orders"
              className="text-muted-foreground hover:text-foreground"
            >
              Pedidos
            </Link>
            <Link
              href="/admin/settings"
              className="text-muted-foreground hover:text-foreground"
            >
              Marca
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              Tienda
            </Link>
            <button
              type="button"
              onClick={() => void handleLogout()}
              disabled={loggingOut}
              className="text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              {loggingOut ? "Saliendo..." : "Salir"}
            </button>
          </nav>
        </div>
      </div>
      {children}
    </div>
  );
}

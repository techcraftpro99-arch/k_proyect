import { ProductsAdminPanel } from "@/components/admin/ProductsAdminPanel";
import { isSupabaseConfigured } from "@/lib/supabase/admin";

export default function AdminProductsPage() {
  const configured = isSupabaseConfigured();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h2 className="mb-2 text-2xl font-bold">Productos</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Crea, edita o elimina productos. Los marcados como &quot;Destacado&quot; aparecen en el
        carrusel del inicio.
      </p>

      {!configured ? (
        <div className="glass-card space-y-3 p-8 text-muted-foreground">
          <p className="font-medium text-foreground">Supabase no está configurado</p>
          <p className="text-sm">
            Para gestionar productos desde aquí necesitas:
          </p>
          <ol className="list-decimal space-y-1 pl-5 text-sm">
            <li>Crear proyecto en Supabase</li>
            <li>Ejecutar la migration SQL en <code>supabase/migrations/</code></li>
            <li>Completar las variables en <code>.env.local</code></li>
            <li>Reiniciar el servidor</li>
          </ol>
        </div>
      ) : (
        <ProductsAdminPanel />
      )}
    </div>
  );
}

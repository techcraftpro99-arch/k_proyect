"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ImageUploadField } from "@/components/admin/FileUploadField";
import { Button } from "@/components/ui/button";
import { resolveStoragePublicUrl } from "@/lib/storage/paths";
import { DEFAULT_BRAND_IMAGE } from "@/lib/brand-constants";

export function BrandSettingsPanel({
  initialPath,
  initialUrl,
}: {
  initialPath: string | null;
  initialUrl: string;
}) {
  const router = useRouter();
  const [path, setPath] = useState(initialPath);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPath ? initialUrl : null
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setPath(initialPath);
    setPreviewUrl(initialPath ? initialUrl : null);
  }, [initialPath, initialUrl]);

  async function save(nextPath: string | null) {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandImagePath: nextPath }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "No se pudo guardar");
      }
      setPath(data.brandImagePath);
      setPreviewUrl(data.brandImagePath ? data.brandImageUrl : null);
      setMessage("Foto guardada. Solo se muestra en la página Sobre mí.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al guardar");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="glass-card max-w-xl space-y-6 p-6">
      <div>
        <h2 className="text-lg font-semibold">Foto de perfil (Sobre mí)</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Se muestra solo en la tarjeta de la página About. El logo del header
          no cambia.
        </p>
      </div>

      <ImageUploadField
        label="Imagen actual"
        folder="brand"
        path={path ?? ""}
        previewUrl={previewUrl}
        hint="Arrastra o haz clic para subir. Se guarda al instante."
        onUploaded={async (uploadedPath, url) => {
          setPath(uploadedPath);
          setPreviewUrl(url || resolveStoragePublicUrl(uploadedPath));
          await save(uploadedPath);
        }}
        onClear={() => {
          void save(null);
        }}
      />

      {!path && (
        <p className="text-xs text-muted-foreground">
          Ahora se usa el logo por defecto:{" "}
          <code className="rounded bg-white/60 px-1">{DEFAULT_BRAND_IMAGE}</code>
        </p>
      )}

      {saving && (
        <p className="text-sm text-muted-foreground">Guardando…</p>
      )}
      {message && <p className="text-sm text-green-700">{message}</p>}
      {error && <p className="text-sm text-destructive">{error}</p>}

      {path && (
        <Button
          type="button"
          variant="outline"
          disabled={saving}
          onClick={() => void save(null)}
        >
          Restaurar logo por defecto
        </Button>
      )}
    </div>
  );
}

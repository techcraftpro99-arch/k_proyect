"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

type UploadBucket = "product-previews" | "digital-assets";

interface UploadResult {
  path: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

async function uploadFile(
  file: File,
  bucket: UploadBucket,
  folder: string
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bucket", bucket);
  formData.append("folder", folder);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error ?? "Error al subir archivo");
  }
  return data as UploadResult;
}

interface ImageUploadFieldProps {
  label: string;
  folder: string;
  path: string;
  previewUrl: string | null;
  onUploaded: (path: string, previewUrl: string) => void;
  onClear: () => void;
  hint?: string;
}

export function ImageUploadField({
  label,
  folder,
  path,
  previewUrl,
  onUploaded,
  onClear,
  hint,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const result = await uploadFile(file, "product-previews", folder);
      onUploaded(result.path, result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div
        className={cn(
          "mt-2 flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/60 bg-white/40 p-4 transition hover:border-[#9E00FF]/50 hover:bg-white/60",
          uploading && "pointer-events-none opacity-70"
        )}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles(e.dataTransfer.files);
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/jfif,.jfif"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />

        {previewUrl ? (
          <div className="relative h-28 w-full max-w-[220px] overflow-hidden rounded-xl">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <>
            <ImagePlus className="mb-2 h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arrastra una imagen o haz clic para elegir
            </p>
          </>
        )}

        {uploading && (
          <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Subiendo...
          </p>
        )}
      </div>

      {path && (
        <div className="mt-2 flex items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="truncate">{path}</span>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 text-red-600 hover:underline"
          >
            <X className="h-3 w-3" />
            Quitar
          </button>
        </div>
      )}

      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

interface GalleryUploadFieldProps {
  label: string;
  folder: string;
  paths: string[];
  previewUrls: string[];
  onChange: (paths: string[], previewUrls: string[]) => void;
}

export function GalleryUploadField({
  label,
  folder,
  paths,
  previewUrls,
  onChange,
}: GalleryUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    setUploading(true);
    setError(null);

    try {
      const uploadedPaths: string[] = [...paths];
      const uploadedUrls: string[] = [...previewUrls];

      for (const file of Array.from(files)) {
        const result = await uploadFile(file, "product-previews", folder);
        uploadedPaths.push(result.path);
        uploadedUrls.push(result.url);
      }

      onChange(uploadedPaths, uploadedUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(index: number) {
    onChange(
      paths.filter((_, i) => i !== index),
      previewUrls.filter((_, i) => i !== index)
    );
  }

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div
        className={cn(
          "mt-2 rounded-2xl border-2 border-dashed border-white/60 bg-white/40 p-4 transition hover:border-[#9E00FF]/50",
          uploading && "opacity-70"
        )}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/70 px-4 py-3 text-sm text-muted-foreground transition hover:bg-white"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subiendo imágenes...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Añadir imágenes a la galería
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,image/jfif,.jfif"
          multiple
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />

        {previewUrls.length > 0 && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {previewUrls.map((url, index) => (
              <div
                key={`${url}-${index}`}
                className="relative aspect-square overflow-hidden rounded-xl"
              >
                <Image
                  src={url}
                  alt={`Preview ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
                <button
                  type="button"
                  onClick={() => removeAt(index)}
                  className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export interface DigitalFileValue {
  storagePath: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
}

interface DigitalFileUploadFieldProps {
  label: string;
  folder: string;
  value: DigitalFileValue | null;
  onUploaded: (value: DigitalFileValue) => void;
  onClear: () => void;
}

export function DigitalFileUploadField({
  label,
  folder,
  value,
  onUploaded,
  onClear,
}: DigitalFileUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    const file = files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    try {
      const result = await uploadFile(file, "digital-assets", folder);
      onUploaded({
        storagePath: result.path,
        fileName: result.fileName,
        fileSize: result.fileSize,
        mimeType: result.mimeType,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al subir");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <p className="text-sm font-medium">{label}</p>
      <div className="mt-2 rounded-2xl border-2 border-dashed border-white/60 bg-white/40 p-4">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/70 px-4 py-3 text-sm text-muted-foreground transition hover:bg-white"
        >
          {uploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Subiendo archivo digital...
            </>
          ) : (
            <>
              <Upload className="h-4 w-4" />
              Subir ZIP, PNG o MOV
            </>
          )}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept=".zip,.png,.mov,application/zip,image/png,video/quicktime"
          className="hidden"
          onChange={(e) => void handleFiles(e.target.files)}
        />

        {value && (
          <div className="mt-3 flex items-center justify-between rounded-xl bg-white/70 px-3 py-2 text-sm">
            <div className="min-w-0">
              <p className="truncate font-medium">{value.fileName}</p>
              <p className="text-xs text-muted-foreground">
                {(value.fileSize / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="inline-flex items-center gap-1 text-red-600 hover:underline"
            >
              <X className="h-3 w-3" />
              Quitar
            </button>
          </div>
        )}
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Archivo privado que recibe el comprador tras el pago (máx. 100 MB)
      </p>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

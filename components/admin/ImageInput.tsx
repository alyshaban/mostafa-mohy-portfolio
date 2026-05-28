"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { UploadCloud } from "lucide-react";
import { IMAGE_BUCKET } from "@/lib/storage";
import { useToast } from "@/components/ui/ToastProvider";
import styles from "./ImageInput.module.css";

type ImageValue = {
  url: string;
  storagePath?: string | null;
};

type ImageInputProps = {
  label: string;
  value: string;
  storagePath?: string | null;
  folder: string;
  onChange: (value: ImageValue) => void;
};

async function compressToWebp(file: File) {
  const imageUrl = URL.createObjectURL(file);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageUrl;
    });

    const maxWidth = 1600;
    const scale = Math.min(1, maxWidth / image.width);
    const width = Math.round(image.width * scale);
    const height = Math.round(image.height * scale);
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (!context) throw new Error("تعذر تجهيز الصورة للضغط");

    context.drawImage(image, 0, 0, width, height);

    return await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("تعذر تحويل الصورة إلى WebP"));
            return;
          }
          resolve(blob);
        },
        "image/webp",
        0.78,
      );
    });
  } finally {
    URL.revokeObjectURL(imageUrl);
  }
}

export default function ImageInput({
  label,
  value,
  storagePath,
  folder,
  onChange,
}: ImageInputProps) {
  const [mode, setMode] = useState<"upload" | "link">(
    storagePath ? "upload" : "link",
  );
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleUpload = async (file?: File) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({ title: "اختار ملف صورة فقط", type: "warning" });
      return;
    }

    setUploading(true);

    try {
      const webpBlob = await compressToWebp(file);
      const fileName = `${crypto.randomUUID()}.webp`;
      const path = `${folder}/${fileName}`;

      const { error } = await supabase.storage
        .from(IMAGE_BUCKET)
        .upload(path, webpBlob, {
          cacheControl: "31536000",
          contentType: "image/webp",
          upsert: false,
        });

      if (error) throw error;

      const { data } = supabase.storage.from(IMAGE_BUCKET).getPublicUrl(path);
      onChange({ url: data.publicUrl, storagePath: path });
      showToast({ title: "تم رفع الصورة وضغطها", type: "success" });
    } catch (error) {
      showToast({
        title: "تعذر رفع الصورة",
        description: (error as Error).message,
        type: "error",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.field}>
      <span className={styles.label}>{label}</span>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${mode === "upload" ? styles.active : ""}`}
          onClick={() => setMode("upload")}
        >
          رفع صورة
        </button>
        <button
          type="button"
          className={`${styles.tab} ${mode === "link" ? styles.active : ""}`}
          onClick={() => setMode("link")}
        >
          رابط صورة
        </button>
      </div>

      {mode === "upload" ? (
        <label className={styles.drop}>
          <UploadCloud size={28} />
          <strong>{uploading ? "جاري الضغط والرفع..." : "اختار صورة من الجهاز"}</strong>
          <span className={styles.hint}>سيتم تحويلها إلى WebP وضغطها قبل الرفع</span>
          <input
            type="file"
            accept="image/*"
            disabled={uploading}
            onChange={(event) => handleUpload(event.target.files?.[0])}
          />
        </label>
      ) : (
        <input
          className={styles.input}
          type="url"
          value={value || ""}
          onChange={(event) =>
            onChange({ url: event.target.value, storagePath: null })
          }
          dir="ltr"
          placeholder="https://..."
        />
      )}

      {value && (
        <div className={styles.preview}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" />
        </div>
      )}
    </div>
  );
}

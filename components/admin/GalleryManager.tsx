"use client";

import { useState } from "react";
import { GalleryImage } from "@/types";
import Image from "next/image";
import styles from "./AdminForms.module.css";
import { Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useDialog } from "@/components/ui/DialogProvider";
import ImageInput from "./ImageInput";
import { ViewableImageButton } from "@/components/ui/ImageViewerProvider";
import { deleteGalleryImageAction, saveGalleryImageAction } from "@/app/actions";

export default function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { confirm } = useDialog();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [imageStoragePath, setImageStoragePath] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const resetForm = () => {
    setEditingId(null);
    setImageUrl("");
    setImageStoragePath(null);
    setCaption("");
    setDisplayOrder(images.length + 1);
  };

  const startEdit = (image: GalleryImage) => {
    setEditingId(image.id);
    setImageUrl(image.image_url);
    setImageStoragePath(image.image_storage_path || null);
    setCaption(image.caption || "");
    setDisplayOrder(image.display_order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "حذف الصورة؟",
      description: "سيتم حذف الصورة من المعرض ولا يمكن التراجع عن هذه العملية.",
      confirmText: "حذف",
      tone: "danger",
    });
    if (!confirmed) return;
    setLoading(true);
    const result = await deleteGalleryImageAction(id);
    if (result.error) {
      showToast({ title: "تعذر حذف الصورة", description: result.error, type: "error" });
    } else {
      setImages(images.filter(img => img.id !== id));
      showToast({
        title: result.data?.storageWarning ? "تم حذف الصورة من المعرض" : "تم حذف الصورة",
        description: result.data?.storageWarning,
        type: result.data?.storageWarning ? "warning" : "success",
      });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await saveGalleryImageAction({
        id: editingId || undefined,
        image_url: imageUrl,
        image_storage_path: imageStoragePath,
        caption,
        display_order: displayOrder,
        category: "general",
      });
      if (result.error) throw new Error(result.error);
      if (!result.data) throw new Error("لم يتم حفظ الصورة");

      if (editingId) {
        setImages(images.map((img) => img.id === editingId ? result.data! : img).sort((a, b) => a.display_order - b.display_order));
        showToast({ title: "تم تحديث الصورة", type: "success" });
      } else {
        setImages([...images, result.data].sort((a, b) => a.display_order - b.display_order));
        showToast({ title: "تمت إضافة الصورة", type: "success" });
      }
      resetForm();
    } catch (err) {
      showToast({
        title: editingId ? "تعذر تحديث الصورة" : "تعذر إضافة الصورة",
        description: (err as Error).message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form} style={{ marginBottom: "3rem" }}>
        <h3>{editingId ? "تعديل صورة" : "إضافة صورة جديدة"}</h3>
        
        <ImageInput
          label="الصورة"
          value={imageUrl}
          storagePath={imageStoragePath}
          folder="gallery"
          onChange={({ url, storagePath }) => {
            setImageUrl(url);
            setImageStoragePath(storagePath || null);
          }}
        />

        <div className={styles.inputGroup}>
          <label>الوصف (Caption)</label>
          <input 
            type="text" 
            value={caption} 
            onChange={(e) => setCaption(e.target.value)} 
          />
        </div>

        <div className={styles.inputGroup}>
          <label>الترتيب</label>
          <input 
            type="number" 
            value={displayOrder} 
            onChange={(e) => setDisplayOrder(parseInt(e.target.value))} 
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
            {loading ? "جاري الحفظ..." : editingId ? "حفظ التعديل" : "إضافة الصورة"}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className={styles.submitBtn} style={{ flex: 1, backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
        {images.map(img => (
          <div key={img.id} style={{ background: "var(--bg-card)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
            <div style={{ position: "relative", width: "100%", height: "200px" }}>
              <Image src={img.image_url} alt={img.caption || "صورة"} fill style={{ objectFit: "cover" }} />
              <ViewableImageButton
                src={img.image_url}
                alt={img.caption || "صورة"}
                title={img.caption || "صورة"}
                className={styles.imageViewButton}
              />
            </div>
            <div style={{ padding: "1rem" }}>
              <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem", fontWeight: "500" }}>{img.caption || "بدون وصف"}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>ترتيب: {img.display_order}</span>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button onClick={() => startEdit(img)} className={styles.iconBtn}>
                    <Pencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(img.id)} className={`${styles.iconBtn} ${styles.danger}`}>
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

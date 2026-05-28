"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { GalleryImage } from "@/types";
import Image from "next/image";
import styles from "./AdminForms.module.css";
import { Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useDialog } from "@/components/ui/DialogProvider";

export default function GalleryManager({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { confirm } = useDialog();
  
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "حذف الصورة؟",
      description: "سيتم حذف الصورة من المعرض ولا يمكن التراجع عن هذه العملية.",
      confirmText: "حذف",
      tone: "danger",
    });
    if (!confirmed) return;
    setLoading(true);
    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) {
      showToast({ title: "تعذر حذف الصورة", description: error.message, type: "error" });
    } else {
      setImages(images.filter(img => img.id !== id));
      showToast({ title: "تم حذف الصورة", type: "success" });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("gallery")
        .insert([{ image_url: imageUrl, caption, display_order: displayOrder, category: "general" }])
        .select()
        .single();

      if (error) throw error;
      setImages([...images, data].sort((a,b) => a.display_order - b.display_order));
      showToast({ title: "تمت إضافة الصورة", type: "success" });
      setImageUrl("");
      setCaption("");
      setDisplayOrder(images.length + 1);
    } catch (err) {
      showToast({ title: "تعذر إضافة الصورة", description: (err as Error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form} style={{ marginBottom: "3rem" }}>
        <h3>إضافة صورة جديدة</h3>
        
        <div className={styles.inputGroup}>
          <label>رابط الصورة (Image URL)</label>
          <input 
            type="url" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
            required 
            dir="ltr"
          />
        </div>

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

        <button type="submit" disabled={loading} className={styles.submitBtn}>
          {loading ? "جاري الإضافة..." : "إضافة الصورة"}
        </button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1.5rem" }}>
        {images.map(img => (
          <div key={img.id} style={{ background: "var(--bg-card)", borderRadius: "12px", overflow: "hidden", border: "1px solid var(--border)" }}>
            <div style={{ position: "relative", width: "100%", height: "200px" }}>
              <Image src={img.image_url} alt={img.caption || "صورة"} fill style={{ objectFit: "cover" }} />
            </div>
            <div style={{ padding: "1rem" }}>
              <p style={{ color: "var(--text-primary)", marginBottom: "0.5rem", fontWeight: "500" }}>{img.caption || "بدون وصف"}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>ترتيب: {img.display_order}</span>
                <button onClick={() => handleDelete(img.id)} style={{ padding: "0.5rem", background: "rgba(255, 101, 132, 0.1)", color: "var(--accent-2)", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

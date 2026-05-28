"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { SocialLink } from "@/types";
import styles from "./AdminForms.module.css";
import { Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useDialog } from "@/components/ui/DialogProvider";

const PLATFORMS = [
  "facebook",
  "youtube",
  "instagram",
  "tiktok",
  "whatsapp",
  "telegram",
  "x",
  "linkedin",
  "github",
  "snapchat",
  "threads",
  "discord",
  "twitch",
  "spotify",
  "soundcloud",
  "behance",
  "website",
  "email",
  "phone",
];

export default function SocialLinksManager({ initialLinks }: { initialLinks: SocialLink[] }) {
  const [links, setLinks] = useState<SocialLink[]>(initialLinks);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { confirm } = useDialog();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [platform, setPlatform] = useState("facebook");
  const [url, setUrl] = useState("");
  const [displayOrder, setDisplayOrder] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const resetForm = () => {
    setEditingId(null);
    setPlatform("facebook");
    setUrl("");
    setDisplayOrder(links.length);
    setIsVisible(true);
  };

  const handleEdit = (link: SocialLink) => {
    setEditingId(link.id);
    setPlatform(link.platform);
    setUrl(link.url);
    setDisplayOrder(link.display_order);
    setIsVisible(link.is_visible);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "حذف الرابط؟",
      description: "سيتم حذف رابط السوشيال من لوحة التحكم والموقع.",
      confirmText: "حذف",
      tone: "danger",
    });
    if (!confirmed) return;
    
    setLoading(true);
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) {
      showToast({ title: "تعذر حذف الرابط", description: error.message, type: "error" });
    } else {
      setLinks(links.filter(l => l.id !== id));
      showToast({ title: "تم حذف الرابط", type: "success" });
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from("social_links")
          .update({ platform, url, display_order: displayOrder, is_visible: isVisible })
          .eq("id", editingId)
          .select()
          .single();

        if (error) throw error;
        setLinks(links.map(l => l.id === editingId ? data : l).sort((a,b) => a.display_order - b.display_order));
        showToast({ title: "تم تعديل الرابط", type: "success" });
      } else {
        const { data, error } = await supabase
          .from("social_links")
          .insert([{ platform, url, display_order: displayOrder, is_visible: isVisible }])
          .select()
          .single();

        if (error) throw error;
        setLinks([...links, data].sort((a,b) => a.display_order - b.display_order));
        showToast({ title: "تمت إضافة الرابط", type: "success" });
      }
      resetForm();
    } catch (err) {
      showToast({ title: "تعذر حفظ الرابط", description: (err as Error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className={styles.form} style={{ marginBottom: "3rem" }}>
        <h3>{editingId ? "تعديل رابط" : "إضافة رابط جديد"}</h3>
        
        <div className={styles.inputGroup}>
          <label>المنصة</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value)} dir="ltr">
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label>الرابط الكامل</label>
          <input 
            type="url" 
            value={url} 
            onChange={(e) => setUrl(e.target.value)} 
            required 
            dir="ltr"
            placeholder="https://..."
          />
        </div>

        <div style={{ display: "flex", gap: "1rem" }}>
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>الترتيب</label>
            <input 
              type="number" 
              value={displayOrder} 
              onChange={(e) => setDisplayOrder(parseInt(e.target.value))} 
            />
          </div>
          
          <div className={styles.inputGroup} style={{ flex: 1 }}>
            <label>حالة الظهور</label>
            <select value={isVisible ? "true" : "false"} onChange={(e) => setIsVisible(e.target.value === "true")}>
              <option value="true">ظاهر</option>
              <option value="false">مخفي</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button type="submit" disabled={loading} className={styles.submitBtn} style={{ flex: 1 }}>
            {loading ? "جاري الحفظ..." : (editingId ? "حفظ التعديلات" : "إضافة")}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className={styles.submitBtn} style={{ flex: 1, backgroundColor: "var(--bg-secondary)", color: "var(--text-primary)" }}>
              إلغاء
            </button>
          )}
        </div>
      </form>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {links.map(link => (
          <div key={link.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1.5rem", background: "var(--bg-card)", border: `1px solid var(--border)`, borderRadius: "12px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                <strong style={{ fontSize: "1.2rem", textTransform: "capitalize", color: "var(--text-primary)" }}>{link.platform}</strong>
                {!link.is_visible && <span style={{ fontSize: "0.8rem", background: "var(--accent-2)", color: "white", padding: "2px 8px", borderRadius: "4px" }}>مخفي</span>}
              </div>
              <a href={link.url} target="_blank" rel="noreferrer" style={{ color: "var(--text-secondary)", fontSize: "0.9rem" }} dir="ltr">{link.url}</a>
            </div>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button onClick={() => handleEdit(link)} style={{ padding: "0.5rem", background: "rgba(108, 99, 255, 0.1)", color: "var(--accent)", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(link.id)} style={{ padding: "0.5rem", background: "rgba(255, 101, 132, 0.1)", color: "var(--accent-2)", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {links.length === 0 && <p style={{ color: "var(--text-secondary)", textAlign: "center" }}>لا يوجد روابط مضافة حالياً.</p>}
      </div>
    </div>
  );
}

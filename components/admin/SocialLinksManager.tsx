"use client";

import { useState } from "react";
import { SocialLink } from "@/types";
import styles from "./AdminForms.module.css";
import listStyles from "./SocialLinksManager.module.css";
import { Trash2, Edit2 } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useDialog } from "@/components/ui/DialogProvider";
import { deleteSocialLinkAction, saveSocialLinkAction } from "@/app/actions";

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
    const result = await deleteSocialLinkAction(id);
    if (result.error) {
      showToast({ title: "تعذر حذف الرابط", description: result.error, type: "error" });
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
      const result = await saveSocialLinkAction({
        id: editingId || undefined,
        platform,
        url,
        display_order: displayOrder,
        is_visible: isVisible,
      });
      if (result.error) throw new Error(result.error);
      if (!result.data) throw new Error("لم يتم حفظ الرابط");

      if (editingId) {
        const data = result.data;
        setLinks(links.map(l => l.id === editingId ? data : l).sort((a,b) => a.display_order - b.display_order));
        showToast({ title: "تم تعديل الرابط", type: "success" });
      } else {
        setLinks([...links, result.data].sort((a,b) => a.display_order - b.display_order));
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
    <div className={listStyles.wrapper}>
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

      <div className={listStyles.list}>
        {links.map(link => (
          <div key={link.id} className={listStyles.item}>
            <div className={listStyles.content}>
              <div className={listStyles.platformRow}>
                <strong className={listStyles.platform}>{link.platform}</strong>
                {!link.is_visible && <span className={listStyles.hiddenBadge}>مخفي</span>}
              </div>
              <a href={link.url} target="_blank" rel="noreferrer" className={listStyles.url}>{link.url}</a>
            </div>
            <div className={listStyles.actions}>
              <button onClick={() => handleEdit(link)} className={`${listStyles.iconBtn} ${listStyles.edit}`}>
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(link.id)} className={`${listStyles.iconBtn} ${listStyles.delete}`}>
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

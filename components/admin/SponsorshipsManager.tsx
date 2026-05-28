"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Sponsorship } from "@/types";
import Image from "next/image";
import styles from "./AdminForms.module.css";
import { Pencil, Trash2, Plus, GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useDialog } from "@/components/ui/DialogProvider";

export default function SponsorshipsManager({
  initialSponsorships,
}: {
  initialSponsorships: Sponsorship[];
}) {
  const [sponsorships, setSponsorships] =
    useState<Sponsorship[]>(initialSponsorships);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSponsorship, setCurrentSponsorship] = useState<
    Partial<Sponsorship>
  >({
    title: "",
    description: "",
    image_url: "",
    video_url: "",
    display_order: 0,
    is_published: true,
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { confirm } = useDialog();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (currentSponsorship.id) {
        const { error } = await supabase
          .from("sponsorships")
          .update(currentSponsorship)
          .eq("id", currentSponsorship.id);
        if (error) throw error;

        setSponsorships((prev) =>
          prev.map((s) =>
            s.id === currentSponsorship.id
              ? ({ ...s, ...currentSponsorship } as Sponsorship)
              : s,
          ),
        );
        showToast({ title: "تم تعديل الإعلان", type: "success" });
      } else {
        const newOrder =
          sponsorships.length > 0
            ? Math.max(...sponsorships.map((s) => s.display_order)) + 1
            : 0;
        const { data, error } = await supabase
          .from("sponsorships")
          .insert([{ ...currentSponsorship, display_order: newOrder }])
          .select()
          .single();
        if (error) throw error;

        if (data) setSponsorships([...sponsorships, data as Sponsorship]);
        showToast({ title: "تمت إضافة الإعلان", type: "success" });
      }
      setIsEditing(false);
      resetForm();
    } catch (error) {
      console.error(error);
      showToast({
        title: "تعذر حفظ الإعلان",
        description: error instanceof Error ? error.message : undefined,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "حذف الإعلان؟",
      description: "سيتم حذف الإعلان أو الرعاية من لوحة التحكم والموقع.",
      confirmText: "حذف",
      tone: "danger",
    });
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("sponsorships")
        .delete()
        .eq("id", id);
      if (error) throw error;
      setSponsorships((prev) => prev.filter((s) => s.id !== id));
      showToast({ title: "تم حذف الإعلان", type: "success" });
    } catch (error) {
      console.error(error);
      showToast({
        title: "تعذر حذف الإعلان",
        description: error instanceof Error ? error.message : undefined,
        type: "error",
      });
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from("sponsorships")
        .update({ is_published: !currentStatus })
        .eq("id", id);
      if (error) throw error;
      setSponsorships((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, is_published: !currentStatus } : s,
        ),
      );
      showToast({
        title: currentStatus ? "تم إخفاء الإعلان" : "تم نشر الإعلان",
        type: "success",
      });
    } catch (error) {
      console.error(error);
      showToast({
        title: "تعذر تحديث حالة الإعلان",
        description: error instanceof Error ? error.message : undefined,
        type: "error",
      });
    }
  };

  const resetForm = () => {
    setCurrentSponsorship({
      title: "",
      description: "",
      image_url: "",
      video_url: "",
      display_order: sponsorships.length,
      is_published: true,
    });
  };

  const startEdit = (sponsorship: Sponsorship) => {
    setCurrentSponsorship(sponsorship);
    setIsEditing(true);
  };

  return (
    <div>
      {!isEditing ? (
        <div>
          <button
            onClick={() => {
              resetForm();
              setIsEditing(true);
            }}
            className={styles.submitBtn}
            style={{
              marginBottom: "2rem",
              width: "auto",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <Plus size={20} />
            إضافة إعلان جديد
          </button>

          <div className={styles.listContainer}>
            {sponsorships.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  padding: "2rem",
                  color: "var(--text-secondary)",
                }}
              >
                لا توجد إعلانات بعد.
              </p>
            ) : (
              sponsorships.map((s) => (
                <div key={s.id} className={styles.listItem}>
                  <div className={styles.itemHeader}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "1rem",
                      }}
                    >
                      <GripVertical
                        size={20}
                        style={{
                          color: "var(--text-secondary)",
                          cursor: "grab",
                        }}
                      />
                      {s.image_url ? (
                        <div
                          style={{
                            position: "relative",
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            overflow: "hidden",
                            flexShrink: 0,
                          }}
                        >
                          <Image
                            src={s.image_url}
                            alt={s.title}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            width: 50,
                            height: 50,
                            borderRadius: "8px",
                            background: "var(--bg-secondary)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          لا توجد
                        </div>
                      )}
                      <div>
                        <h3 style={{ margin: 0, fontSize: "1.1rem" }}>
                          {s.title}
                        </h3>
                        <p
                          style={{
                            margin: 0,
                            fontSize: "0.9rem",
                            color: "var(--text-secondary)",
                          }}
                        >
                          الحالة:{" "}
                          <span
                            style={{
                              color: s.is_published
                                ? "#25D366"
                                : "var(--text-secondary)",
                            }}
                          >
                            {s.is_published ? "منشور" : "مخفي"}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className={styles.actions}>
                      <button
                        onClick={() =>
                          handleTogglePublish(s.id, s.is_published)
                        }
                        className={styles.iconBtn}
                        title={s.is_published ? "إخفاء" : "نشر"}
                      >
                        <div
                          style={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: s.is_published
                              ? "#25D366"
                              : "var(--text-secondary)",
                          }}
                        />
                      </button>
                      <button
                        onClick={() => startEdit(s)}
                        className={styles.iconBtn}
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className={`${styles.iconBtn} ${styles.danger}`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className={styles.form}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <h2 style={{ margin: 0 }}>
              {currentSponsorship.id ? "تعديل الإعلان" : "إضافة إعلان جديد"}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              style={{
                background: "none",
                border: "none",
                color: "var(--text-secondary)",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              إلغاء
            </button>
          </div>

          <div className={styles.inputGroup}>
            <label>اسم المشروع / المحل</label>
            <input
              type="text"
              value={currentSponsorship.title || ""}
              onChange={(e) =>
                setCurrentSponsorship({
                  ...currentSponsorship,
                  title: e.target.value,
                })
              }
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>وصف الإعلان</label>
            <textarea
              value={currentSponsorship.description || ""}
              onChange={(e) =>
                setCurrentSponsorship({
                  ...currentSponsorship,
                  description: e.target.value,
                })
              }
              rows={3}
            />
          </div>

          <div className={styles.inputGroup}>
            <label>رابط الصورة / اللوجو (URL)</label>
            <input
              type="url"
              value={currentSponsorship.image_url || ""}
              onChange={(e) =>
                setCurrentSponsorship({
                  ...currentSponsorship,
                  image_url: e.target.value,
                })
              }
              dir="ltr"
            />
            {currentSponsorship.image_url && (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "200px",
                  borderRadius: "12px",
                  overflow: "hidden",
                  marginTop: "1rem",
                }}
              >
                <Image
                  src={currentSponsorship.image_url}
                  alt="Preview"
                  fill
                  style={{ objectFit: "cover" }}
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>
            )}
          </div>

          <div className={styles.inputGroup}>
            <label>رابط فيديو الإعلان على المنصة</label>
            <input
              type="url"
              value={currentSponsorship.video_url || ""}
              onChange={(e) =>
                setCurrentSponsorship({
                  ...currentSponsorship,
                  video_url: e.target.value,
                })
              }
              dir="ltr"
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              marginBottom: "1rem",
            }}
          >
            <input
              type="checkbox"
              id="is_published"
              checked={currentSponsorship.is_published}
              onChange={(e) =>
                setCurrentSponsorship({
                  ...currentSponsorship,
                  is_published: e.target.checked,
                })
              }
              style={{ width: "auto" }}
            />
            <label
              htmlFor="is_published"
              style={{ margin: 0, cursor: "pointer" }}
            >
              نشر الإعلان للعامة
            </label>
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? "جاري الحفظ..." : "حفظ الإعلان"}
          </button>
        </form>
      )}
    </div>
  );
}

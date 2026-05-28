"use client";

import { useState } from "react";
import { Profile } from "@/types";
import styles from "./AdminForms.module.css";
import { useToast } from "@/components/ui/ToastProvider";
import ImageInput from "./ImageInput";
import { saveProfileAction } from "@/app/actions";

export default function ProfileForm({ initialProfile }: { initialProfile: Profile | null }) {
  const [profile, setProfile] = useState<Partial<Profile>>(initialProfile || {
    name: "",
    bio: "",
    avatar_url: "",
    avatar_storage_path: null,
    cover_url: "",
    cover_storage_path: null,
    followers_count: 0,
    views_count: 0,
    likes_count: 0,
    videos_count: 0,
    ads_description: "",
    ads_contact_url: "",
  });
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await saveProfileAction(profile);
      if (result.error) throw new Error(result.error);
      if (result.data) setProfile(result.data);
      showToast({
        title: profile.id ? "تم تحديث الملف الشخصي" : "تم إنشاء الملف الشخصي",
        type: "success",
      });
    } catch (err) {
      showToast({
        title: "تعذر حفظ الملف الشخصي",
        description: (err as Error).message,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label>الاسم الكامل</label>
        <input 
          type="text" 
          value={profile.name || ""} 
          onChange={(e) => setProfile({...profile, name: e.target.value})}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>الوصف (Bio)</label>
        <textarea 
          value={profile.bio || ""} 
          onChange={(e) => setProfile({...profile, bio: e.target.value})}
          rows={4}
        />
      </div>

      <ImageInput
        label="الصورة الشخصية"
        value={profile.avatar_url || ""}
        storagePath={profile.avatar_storage_path}
        folder="profile"
        onChange={({ url, storagePath }) =>
          setProfile({
            ...profile,
            avatar_url: url,
            avatar_storage_path: storagePath || null,
          })
        }
      />

      <ImageInput
        label="صورة الغلاف"
        value={profile.cover_url || ""}
        storagePath={profile.cover_storage_path}
        folder="profile"
        onChange={({ url, storagePath }) =>
          setProfile({
            ...profile,
            cover_url: url,
            cover_storage_path: storagePath || null,
          })
        }
      />

      <h3 style={{marginTop: "2rem", marginBottom: "1rem", color: "var(--text-primary)"}}>إحصائيات الهيرو</h3>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "1rem" }}>
        <div className={styles.inputGroup}>
          <label>عدد المتابعين</label>
          <input
            type="number"
            min={0}
            value={profile.followers_count ?? 0}
            onChange={(e) => setProfile({ ...profile, followers_count: Number(e.target.value) })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>عدد المشاهدات</label>
          <input
            type="number"
            min={0}
            value={profile.views_count ?? 0}
            onChange={(e) => setProfile({ ...profile, views_count: Number(e.target.value) })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>عدد الإعجابات</label>
          <input
            type="number"
            min={0}
            value={profile.likes_count ?? 0}
            onChange={(e) => setProfile({ ...profile, likes_count: Number(e.target.value) })}
          />
        </div>

        <div className={styles.inputGroup}>
          <label>عدد الفيديوهات</label>
          <input
            type="number"
            min={0}
            value={profile.videos_count ?? 0}
            onChange={(e) => setProfile({ ...profile, videos_count: Number(e.target.value) })}
          />
        </div>
      </div>

      <h3 style={{marginTop: "2rem", marginBottom: "1rem", color: "var(--text-primary)"}}>إعدادات الإعلانات</h3>
      
      <div className={styles.inputGroup}>
        <label>وصف خدمة الإعلان (يظهر في صفحة الإعلانات)</label>
        <textarea 
          value={profile.ads_description || ""} 
          onChange={(e) => setProfile({...profile, ads_description: e.target.value})}
          rows={3}
        />
      </div>

      <div className={styles.inputGroup}>
        <label>رابط التواصل للإعلانات (رقم واتساب أو رابط فيسبوك)</label>
        <input 
          type="url" 
          value={profile.ads_contact_url || ""} 
          onChange={(e) => setProfile({...profile, ads_contact_url: e.target.value})}
          dir="ltr"
          placeholder="https://wa.me/..."
        />
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? "جاري الحفظ..." : "حفظ التعديلات"}
      </button>
    </form>
  );
}

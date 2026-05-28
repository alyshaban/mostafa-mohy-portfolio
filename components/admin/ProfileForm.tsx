"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Profile } from "@/types";
import styles from "./AdminForms.module.css";
import { useToast } from "@/components/ui/ToastProvider";
import ImageInput from "./ImageInput";
import { removeStorageImage } from "@/lib/storage";

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

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialProfile?.id) {
        const { error } = await supabase
          .from("profile")
          .update({
            name: profile.name,
            bio: profile.bio,
            avatar_url: profile.avatar_url,
            avatar_storage_path: profile.avatar_storage_path,
            cover_url: profile.cover_url,
            cover_storage_path: profile.cover_storage_path,
            followers_count: profile.followers_count,
            views_count: profile.views_count,
            likes_count: profile.likes_count,
            videos_count: profile.videos_count,
            ads_description: profile.ads_description,
            ads_contact_url: profile.ads_contact_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialProfile.id);

        if (error) throw error;
        if (
          initialProfile.avatar_storage_path &&
          initialProfile.avatar_storage_path !== profile.avatar_storage_path
        ) {
          await removeStorageImage(supabase, initialProfile.avatar_storage_path);
        }
        if (
          initialProfile.cover_storage_path &&
          initialProfile.cover_storage_path !== profile.cover_storage_path
        ) {
          await removeStorageImage(supabase, initialProfile.cover_storage_path);
        }
        showToast({ title: "تم تحديث الملف الشخصي", type: "success" });
      } else {
        const { error } = await supabase
          .from("profile")
          .insert([
            {
              name: profile.name,
              bio: profile.bio,
              avatar_url: profile.avatar_url,
              avatar_storage_path: profile.avatar_storage_path,
              cover_url: profile.cover_url,
              cover_storage_path: profile.cover_storage_path,
              followers_count: profile.followers_count,
              views_count: profile.views_count,
              likes_count: profile.likes_count,
              videos_count: profile.videos_count,
              ads_description: profile.ads_description,
              ads_contact_url: profile.ads_contact_url,
            }
          ]);

        if (error) throw error;
        showToast({ title: "تم إنشاء الملف الشخصي", type: "success" });
      }
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

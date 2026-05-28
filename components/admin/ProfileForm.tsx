"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Profile } from "@/types";
import styles from "./AdminForms.module.css";
import { useToast } from "@/components/ui/ToastProvider";

export default function ProfileForm({ initialProfile }: { initialProfile: Profile | null }) {
  const [profile, setProfile] = useState<Partial<Profile>>(initialProfile || {
    name: "",
    bio: "",
    avatar_url: "",
    cover_url: "",
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
            cover_url: profile.cover_url,
            ads_description: profile.ads_description,
            ads_contact_url: profile.ads_contact_url,
            updated_at: new Date().toISOString(),
          })
          .eq("id", initialProfile.id);

        if (error) throw error;
        showToast({ title: "تم تحديث الملف الشخصي", type: "success" });
      } else {
        const { error } = await supabase
          .from("profile")
          .insert([
            {
              name: profile.name,
              bio: profile.bio,
              avatar_url: profile.avatar_url,
              cover_url: profile.cover_url,
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

      <div className={styles.inputGroup}>
        <label>رابط الصورة الشخصية (Avatar URL)</label>
        <input 
          type="url" 
          value={profile.avatar_url || ""} 
          onChange={(e) => setProfile({...profile, avatar_url: e.target.value})}
          dir="ltr"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>رابط صورة الغلاف (Cover URL)</label>
        <input 
          type="url" 
          value={profile.cover_url || ""} 
          onChange={(e) => setProfile({...profile, cover_url: e.target.value})}
          dir="ltr"
        />
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

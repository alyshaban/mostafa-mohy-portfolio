import { createClient } from "@/lib/supabase/server";
import styles from "./dashboard.module.css";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const supabase = createClient();

  const { count: postsCount } = await supabase.from("posts").select("*", { count: "exact", head: true });
  const { count: galleryCount } = await supabase.from("gallery").select("*", { count: "exact", head: true });
  const { count: contactsCount } = await supabase.from("contacts").select("*", { count: "exact", head: true });

  return (
    <div>
      <h1 className={styles.title}>مرحباً بك في لوحة التحكم 👋</h1>
      <p className={styles.subtitle}>هنا يمكنك إدارة كل محتوى الموقع الخاص بك بسهولة.</p>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <h3>إجمالي البوستات</h3>
          <div className={styles.number}>{postsCount || 0}</div>
        </div>
        <div className={styles.statCard}>
          <h3>الصور في المعرض</h3>
          <div className={styles.number}>{galleryCount || 0}</div>
        </div>
        <div className={styles.statCard}>
          <h3>رسائل التواصل</h3>
          <div className={styles.number}>{contactsCount || 0}</div>
        </div>
      </div>
    </div>
  );
}

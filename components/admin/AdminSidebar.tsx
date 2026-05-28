"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { 
  LayoutDashboard, 
  User, 
  Share2, 
  FileText, 
  Image as ImageIcon, 
  MessageSquare, 
  Megaphone,
  LogOut 
} from "lucide-react";
import styles from "./AdminSidebar.module.css";

const menuItems = [
  { name: "لوحة التحكم", path: "/admin", icon: <LayoutDashboard size={20} /> },
  { name: "الملف الشخصي", path: "/admin/profile", icon: <User size={20} /> },
  { name: "روابط السوشيال", path: "/admin/social", icon: <Share2 size={20} /> },
  { name: "المحتوى والبوستات", path: "/admin/posts", icon: <FileText size={20} /> },
  { name: "معرض الصور", path: "/admin/gallery", icon: <ImageIcon size={20} /> },
  { name: "رسائل التواصل", path: "/admin/contacts", icon: <MessageSquare size={20} /> },
  { name: "الإعلانات والرعايات", path: "/admin/sponsorships", icon: <Megaphone size={20} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h2>لوحة الإدارة</h2>
      </div>
      
      <nav className={styles.nav}>
        {menuItems.map((item) => {
          const isActive =
            pathname === item.path ||
            (item.path !== "/admin" && pathname.startsWith(`${item.path}/`));
          return (
            <Link 
              key={item.path} 
              href={item.path}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className={styles.footer}>
        <button onClick={handleLogout} className={styles.logoutBtn}>
          <LogOut size={20} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  );
}

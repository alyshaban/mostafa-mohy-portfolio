"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { Post } from "@/types";
import Image from "next/image";
import { Trash2, Edit2, ExternalLink } from "lucide-react";
import Link from "next/link";
import styles from "./PostsList.module.css";
import { useToast } from "@/components/ui/ToastProvider";
import { useDialog } from "@/components/ui/DialogProvider";

export default function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const { showToast } = useToast();
  const { confirm } = useDialog();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "حذف البوست؟",
      description: "سيتم حذف البوست من لوحة التحكم ولن يظهر في الموقع.",
      confirmText: "حذف",
      tone: "danger",
    });
    if (!confirmed) return;
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      showToast({ title: "تعذر حذف البوست", description: error.message, type: "error" });
    } else {
      setPosts(posts.filter(p => p.id !== id));
      showToast({ title: "تم حذف البوست", type: "success" });
    }
  };

  return (
    <div className={styles.list}>
      {posts.map(post => (
        <div key={post.id} className={styles.item}>
          <div className={styles.imageWrap}>
            <Image src={post.cover_image || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop"} alt={post.title} fill style={{ objectFit: "cover" }} />
          </div>
          
          <div className={styles.content}>
            <h3 className={styles.title}>{post.title}</h3>
            <p className={styles.description}>
              {post.description}
            </p>
          </div>
          
          <div className={styles.actions}>
            <a href={post.facebook_url} target="_blank" rel="noreferrer" className={`${styles.iconAction} ${styles.external}`} title="عرض على فيسبوك">
              <ExternalLink size={18} />
            </a>
            <Link href={`/admin/posts/${post.id}`} className={`${styles.iconAction} ${styles.edit}`}>
              <Edit2 size={18} />
            </Link>
            <button onClick={() => handleDelete(post.id)} className={`${styles.iconAction} ${styles.delete}`}>
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      {posts.length === 0 && <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>لا يوجد بوستات مضافة حتى الآن.</p>}
    </div>
  );
}

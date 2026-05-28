"use client";

import { useState } from "react";
import { Post } from "@/types";
import Image from "next/image";
import { Trash2, Edit2, ExternalLink, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import styles from "./PostsList.module.css";
import { useToast } from "@/components/ui/ToastProvider";
import { useDialog } from "@/components/ui/DialogProvider";
import { ViewableImageButton } from "@/components/ui/ImageViewerProvider";
import { deletePostAction, togglePostPublishAction } from "@/app/actions";

export default function PostsList({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const { showToast } = useToast();
  const { confirm } = useDialog();
  
  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "حذف البوست؟",
      description: "سيتم حذف البوست من لوحة التحكم ولن يظهر في الموقع.",
      confirmText: "حذف",
      tone: "danger",
    });
    if (!confirmed) return;
    setLoadingId(id);
    try {
      const result = await deletePostAction(id);
      if (result.error) {
        showToast({ title: "تعذر حذف البوست", description: result.error, type: "error" });
      } else {
        setPosts(posts.filter(p => p.id !== id));
        showToast({
          title: "تم حذف البوست",
          description: result.data?.storageWarning ? "لكن تعذر حذف صورة الغلاف من Storage." : undefined,
          type: result.data?.storageWarning ? "warning" : "success",
        });
      }
    } finally {
      setLoadingId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    setLoadingId(id);
    try {
      const result = await togglePostPublishAction(id, currentStatus);
      if (result.error) {
        showToast({ title: "تعذر تغيير حالة البوست", description: result.error, type: "error" });
      } else if (result.data) {
        setPosts(posts.map(p => p.id === id ? { ...p, is_published: result.data!.is_published } : p));
        showToast({ title: result.data.is_published ? "تم نشر البوست" : "تم إخفاء البوست", type: "success" });
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className={styles.list}>
      {posts.map(post => (
        <div key={post.id} className={styles.item}>
          <div className={styles.imageWrap}>
            <Image src={post.cover_image || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop"} alt={post.title} fill style={{ objectFit: "cover" }} />
            <ViewableImageButton
              src={post.cover_image || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=400&auto=format&fit=crop"}
              alt={post.title}
              title={post.title}
              className={styles.viewButton}
            />
          </div>
          
          <div className={styles.content}>
            <h3 className={styles.title}>
              {post.title}
              {!post.is_published && (
                <span style={{ fontSize: "0.7rem", padding: "0.2rem 0.5rem", background: "var(--bg-secondary)", borderRadius: "4px", color: "var(--text-secondary)", marginRight: "0.5rem" }}>
                  مسودة
                </span>
              )}
            </h3>
            <p className={styles.description}>
              {post.description}
            </p>
          </div>
          
          <div className={styles.actions}>
            <a href={post.facebook_url} target="_blank" rel="noreferrer" className={`${styles.iconAction} ${styles.external}`} title="عرض على فيسبوك">
              <ExternalLink size={18} />
            </a>
            <button 
              onClick={() => handleTogglePublish(post.id, post.is_published)} 
              className={styles.iconAction} 
              title={post.is_published ? "إخفاء البوست" : "نشر البوست"}
              disabled={loadingId === post.id}
              style={{ opacity: loadingId === post.id ? 0.5 : 1 }}
            >
              {post.is_published ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <Link href={`/admin/posts/${post.id}`} className={`${styles.iconAction} ${styles.edit}`}>
              <Edit2 size={18} />
            </Link>
            <button 
              onClick={() => handleDelete(post.id)} 
              className={`${styles.iconAction} ${styles.delete}`}
              disabled={loadingId === post.id}
              style={{ opacity: loadingId === post.id ? 0.5 : 1 }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      ))}
      {posts.length === 0 && <p style={{ textAlign: "center", color: "var(--text-secondary)" }}>لا يوجد بوستات مضافة حتى الآن.</p>}
    </div>
  );
}

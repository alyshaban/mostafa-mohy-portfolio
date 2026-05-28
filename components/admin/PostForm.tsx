"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import styles from "./AdminForms.module.css";
import { useToast } from "@/components/ui/ToastProvider";

export default function PostForm({ initialPost }: { initialPost?: Post }) {
  const [post, setPost] = useState<Partial<Post>>(
    initialPost || {
      title: "",
      description: "",
      cover_image: "",
      facebook_url: "",
      category: "general",
      is_published: true,
    },
  );

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (initialPost?.id) {
        const { error } = await supabase
          .from("posts")
          .update(post)
          .eq("id", initialPost.id);
        if (error) throw error;
        showToast({ title: "تم تعديل البوست", type: "success" });
      } else {
        const { error } = await supabase.from("posts").insert([post]);
        if (error) throw error;
        showToast({ title: "تمت إضافة البوست", type: "success" });
        router.push("/admin/posts");
        router.refresh();
      }
    } catch (err) {
      showToast({ title: "تعذر حفظ البوست", description: (err as Error).message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.inputGroup}>
        <label>عنوان البوست</label>
        <input
          type="text"
          value={post.title || ""}
          onChange={(e) => setPost({ ...post, title: e.target.value })}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>وصف قصير</label>
        <textarea
          value={post.description || ""}
          onChange={(e) => setPost({ ...post, description: e.target.value })}
          rows={3}
          required
        />
      </div>

      <div className={styles.inputGroup}>
        <label>رابط الصورة (Cover Image URL)</label>
        <input
          type="url"
          value={post.cover_image || ""}
          onChange={(e) => setPost({ ...post, cover_image: e.target.value })}
          dir="ltr"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>رابط البوست على المنصة</label>
        <input
          type="url"
          value={post.facebook_url || ""}
          onChange={(e) => setPost({ ...post, facebook_url: e.target.value })}
          required
          dir="ltr"
        />
      </div>

      <div className={styles.inputGroup}>
        <label>حالة النشر</label>
        <select
          value={post.is_published ? "true" : "false"}
          onChange={(e) =>
            setPost({ ...post, is_published: e.target.value === "true" })
          }
        >
          <option value="true">منشور ومتاح</option>
          <option value="false">مسودة (مخفي)</option>
        </select>
      </div>

      <button type="submit" disabled={loading} className={styles.submitBtn}>
        {loading ? "جاري الحفظ..." : "حفظ البوست"}
      </button>
    </form>
  );
}

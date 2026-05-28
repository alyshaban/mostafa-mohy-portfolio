"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Post } from "@/types";
import styles from "./AdminForms.module.css";
import { useToast } from "@/components/ui/ToastProvider";
import ImageInput from "./ImageInput";
import { savePostAction } from "@/app/actions";

export default function PostForm({ initialPost }: { initialPost?: Post }) {
  const [post, setPost] = useState<Partial<Post>>(
    initialPost || {
      title: "",
      description: "",
      cover_image: "",
      cover_storage_path: null,
      facebook_url: "",
      category: "general",
      is_published: true,
    },
  );

  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await savePostAction({
        ...post,
        id: initialPost?.id,
      });
      if (result.error) throw new Error(result.error);

      if (initialPost?.id) {
        if (result.data) setPost(result.data);
        showToast({ title: "تم تعديل البوست", type: "success" });
      } else {
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

      <ImageInput
        label="صورة الغلاف"
        value={post.cover_image || ""}
        storagePath={post.cover_storage_path}
        folder="posts"
        onChange={({ url, storagePath }) =>
          setPost({
            ...post,
            cover_image: url,
            cover_storage_path: storagePath || null,
          })
        }
      />

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

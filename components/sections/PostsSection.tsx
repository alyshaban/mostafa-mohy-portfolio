"use client";

import Image from "next/image";
import { Post } from "@/types";
import Link from "next/link";
import styles from "./PostsSection.module.css";
import { Play, ArrowLeft } from "lucide-react";
import { ViewableImageButton } from "@/components/ui/ImageViewerProvider";

export default function PostsSection({ posts, preview = false }: { posts: Post[], preview?: boolean }) {
  const publishedPosts = posts.filter(p => p.is_published);
  const displayPosts = preview ? publishedPosts.slice(0, 3) : publishedPosts;
  
  if (publishedPosts.length === 0) return (
    <section className={styles.section} id="content">
      <div className={styles.container}>
        <h2 className={styles.title}>أحدث المحتوى</h2>
        <p style={{color: "var(--text-secondary)", textAlign: "center"}}>لم يتم إضافة بوستات بعد.</p>
      </div>
    </section>
  );

  return (
    <section className={styles.section} id="content">
      <div className={styles.container}>
        <h2 className={styles.title}>أحدث المحتوى</h2>
        <div className={styles.grid}>
          {displayPosts.map(post => (
            <a key={post.id} href={post.facebook_url} target="_blank" rel="noreferrer" className={styles.card}>
              <div className={styles.imageWrapper}>
                <Image
                  src={post.cover_image || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop"}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className={styles.image}
                />
                <div className={styles.playOverlay}>
                  <Play size={40} fill="white" />
                </div>
                <span onClick={(event) => event.preventDefault()}>
                  <ViewableImageButton
                    src={post.cover_image || "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=2000&auto=format&fit=crop"}
                    alt={post.title}
                    title={post.title}
                    className={styles.viewImageBtn}
                  />
                </span>
              </div>
              <div className={styles.content}>
                <h3 className={styles.postTitle}>{post.title}</h3>
                <p className={styles.postDesc}>{post.description}</p>
              </div>
            </a>
          ))}
        </div>
        {preview && publishedPosts.length > 3 && (
          <div className={styles.viewAllWrapper}>
            <Link href="/posts" className={styles.viewAllBtn}>
              عرض كل المحتوى
              <ArrowLeft size={18} />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}

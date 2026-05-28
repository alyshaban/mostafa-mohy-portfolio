"use client";

import { GalleryImage } from "@/types";
import Link from "next/link";
import Image from "next/image";
import styles from "./GallerySection.module.css";
import { ArrowLeft } from "lucide-react";
import { useImageViewer } from "@/components/ui/ImageViewerProvider";

export default function GallerySection({ images, preview = false }: { images: GalleryImage[], preview?: boolean }) {
  const { openImage } = useImageViewer();
  const displayImages = preview ? images.slice(0, 6) : images;

  if (images.length === 0) return (
    <section className={styles.section} id="gallery">
      <div className={styles.container}>
        <h2 className={styles.title}>معرض الصور</h2>
        <p style={{color: "var(--text-secondary)", textAlign: "center"}}>لم يتم إضافة صور بعد.</p>
      </div>
    </section>
  );

  return (
    <section className={styles.section} id="gallery">
      <div className={styles.container}>
        <h2 className={styles.title}>معرض الصور</h2>
        <div className={styles.grid}>
          {displayImages.map(img => (
            <button
              key={img.id}
              type="button"
              className={styles.imgWrapper}
              onClick={() => openImage({ src: img.image_url, alt: img.caption || "صورة من المعرض", title: img.caption })}
            >
              <Image 
                src={img.image_url} 
                alt={img.caption || "صورة من المعرض"} 
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={styles.image} 
              />
              <div className={styles.captionOverlay}>
                <p>{img.caption}</p>
              </div>
            </button>
          ))}
        </div>
        {preview && images.length > 6 && (
          <div className={styles.viewAllWrapper}>
            <Link href="/gallery" className={styles.viewAllBtn}>
              عرض كل الصور
              <ArrowLeft size={18} />
            </Link>
          </div>
        )}
      </div>

    </section>
  );
}

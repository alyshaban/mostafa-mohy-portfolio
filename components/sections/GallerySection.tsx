"use client";

import { GalleryImage } from "@/types";
import Link from "next/link";
import Image from "next/image";
import styles from "./GallerySection.module.css";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

export default function GallerySection({ images, preview = false }: { images: GalleryImage[], preview?: boolean }) {
  const [selectedImg, setSelectedImg] = useState<string | null>(null);
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
            <div key={img.id} className={styles.imgWrapper} onClick={() => setSelectedImg(img.image_url)}>
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
            </div>
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

      {selectedImg && (
        <div className={styles.lightbox} onClick={() => setSelectedImg(null)}>
          <button className={styles.closeBtn} onClick={() => setSelectedImg(null)}>&times;</button>
          <div style={{ position: "relative", width: "90vw", height: "90vh" }}>
            <Image 
              src={selectedImg} 
              alt="Enlarged" 
              fill
              style={{ objectFit: "contain" }}
              className={styles.lightboxImg} 
            />
          </div>
        </div>
      )}
    </section>
  );
}

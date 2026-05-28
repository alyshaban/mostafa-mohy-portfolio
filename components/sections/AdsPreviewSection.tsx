"use client";

import { Sponsorship } from "@/types";
import Link from "next/link";
import Image from "next/image";
import styles from "./AdsPreviewSection.module.css";
import { Play, ArrowLeft, Megaphone } from "lucide-react";
import { ViewableImageButton } from "@/components/ui/ImageViewerProvider";

export default function AdsPreviewSection({ sponsorships }: { sponsorships: Sponsorship[] }) {
  const published = sponsorships.filter(s => s.is_published).slice(0, 4);

  return (
    <section className={styles.section} id="ads">
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.titleWrapper}>
            <Megaphone size={28} className={styles.titleIcon} />
            <h2 className={styles.title}>أعمالنا الإعلانية</h2>
          </div>
          <p className={styles.subtitle}>شاهد بعض الإعلانات التي قمنا بتنفيذها لعملائنا</p>
        </div>

        {published.length === 0 ? (
          <p className={styles.empty}>لم يتم إضافة إعلانات بعد.</p>
        ) : (
          <div className={styles.grid}>
            {published.map(s => (
              <div key={s.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {s.image_url ? (
                    <>
                    <Image 
                      src={s.image_url} 
                      alt={s.title || "إعلان"} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.image} 
                    />
                    <ViewableImageButton
                      src={s.image_url}
                      alt={s.title || "إعلان"}
                      title={s.title || "إعلان"}
                      className={styles.viewImageBtn}
                    />
                    </>
                  ) : (
                    <div className={styles.placeholder}>
                      <Megaphone size={40} />
                    </div>
                  )}
                  <div className={styles.overlay} />
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  {s.description && <p className={styles.cardDesc}>{s.description}</p>}
                  {s.video_url && (
                    <a href={s.video_url} target="_blank" rel="noreferrer" className={styles.watchBtn}>
                      <Play size={16} fill="currentColor" />
                      مشاهدة الإعلان
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <Link href="/ads" className={styles.viewAllBtn}>
            عرض كل الإعلانات والتفاصيل
            <ArrowLeft size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}

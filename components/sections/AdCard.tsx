"use client";

import Image from "next/image";
import { Megaphone, Play } from "lucide-react";
import { Sponsorship } from "@/types";
import { ViewableImageButton } from "@/components/ui/ImageViewerProvider";
import styles from "@/app/ads/AdsPage.module.css";

export default function AdCard({ sponsorship }: { sponsorship: Sponsorship }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        {sponsorship.image_url ? (
          <>
            <Image
              src={sponsorship.image_url}
              alt={sponsorship.title || "إعلان"}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={styles.image}
            />
            <ViewableImageButton
              src={sponsorship.image_url}
              alt={sponsorship.title || "إعلان"}
              title={sponsorship.title || "إعلان"}
              className={styles.viewImageBtn}
            />
          </>
        ) : (
          <div className={styles.placeholder}>
            <Megaphone size={48} />
          </div>
        )}
      </div>
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{sponsorship.title}</h3>
        {sponsorship.description && (
          <p className={styles.cardDesc}>{sponsorship.description}</p>
        )}

        {sponsorship.video_url && (
          <a
            href={sponsorship.video_url}
            target="_blank"
            rel="noreferrer"
            className={styles.watchBtn}
          >
            <Play size={18} fill="currentColor" />
            شاهد فيديو الإعلان
          </a>
        )}
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Profile } from "@/types";
import styles from "./HeroSection.module.css";
import { Users, Eye, Heart, Video, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useImageViewer } from "@/components/ui/ImageViewerProvider";

export default function HeroSection({ profile }: { profile: Profile | null }) {
  const { openImage } = useImageViewer();
  const p = profile || {
    name: "مصطفى محي",
    bio: "أهلاً بك في موقعي الشخصي",
    avatar_url: "https://ui-avatars.com/api/?name=Mostafa+Mohy&size=200&background=6c63ff&color=fff",
    cover_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    followers_count: 0,
    views_count: 0,
    likes_count: 0,
    videos_count: 0
  };
  const coverUrl = p.cover_url || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop";
  const avatarUrl = p.avatar_url || "https://ui-avatars.com/api/?name=Mostafa+Mohy&size=200&background=6c63ff&color=fff";

  return (
    <section className={styles.hero}>
      <button
        type="button"
        className={styles.coverWrapper}
        onClick={() => openImage({ src: coverUrl, alt: "Cover", title: p.name })}
      >
        <Image 
          src={coverUrl} 
          alt="Cover" 
          fill
          priority
          className={styles.cover} 
        />
        <div className={styles.overlay}></div>
      </button>
      
      <div className={styles.container}>
        <div className={styles.profileBox}>
          <button
            type="button"
            className={styles.avatarButton}
            onClick={() => openImage({ src: avatarUrl, alt: p.name, title: p.name })}
          >
            <Image 
              src={avatarUrl} 
              alt={p.name} 
              width={150}
              height={150}
              priority
              className={styles.avatar} 
            />
          </button>
          <h1 className={styles.name}>{p.name}</h1>
          <p className={styles.bio}>{p.bio}</p>

          <div className={styles.ctaWrapper}>
            <Link href="#contact" className={styles.ctaButton}>
              <MessageCircle size={20} />
              <span>تواصل معي</span>
            </Link>
          </div>

          <div className={styles.stats}>
            <div className={styles.statItem}>
              <Users size={24} className={styles.statIcon} />
              <div className={styles.statText}>
                <span className={styles.statNumber}>{(p.followers_count / 1000).toFixed(1)}K</span>
                <span className={styles.statLabel}>متابع</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <Eye size={24} className={styles.statIcon} />
              <div className={styles.statText}>
                <span className={styles.statNumber}>{(p.views_count / 1000000).toFixed(1)}M</span>
                <span className={styles.statLabel}>مشاهدة</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <Heart size={24} className={styles.statIcon} />
              <div className={styles.statText}>
                <span className={styles.statNumber}>{(p.likes_count / 1000).toFixed(1)}K</span>
                <span className={styles.statLabel}>إعجاب</span>
              </div>
            </div>
            <div className={styles.statItem}>
              <Video size={24} className={styles.statIcon} />
              <div className={styles.statText}>
                <span className={styles.statNumber}>{p.videos_count}</span>
                <span className={styles.statLabel}>فيديو</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

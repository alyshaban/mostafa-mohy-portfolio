import Image from "next/image";
import styles from "./AdsPage.module.css";
import { Play, Megaphone, Send } from "lucide-react";
import { getProfile, getSponsorships } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function AdsPage() {
  const [profile, sponsorships] = await Promise.all([
    getProfile(),
    getSponsorships(),
  ]);

  const publishedAds = sponsorships.filter(s => s.is_published);

  return (
    <div className={styles.page}>
      {/* Hero Section for Ads */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>أعلن <span>معنا</span></h1>
        <p className={styles.heroDesc}>
          {profile?.ads_description || "نقدم خدمات إعلانية متكاملة لتغطية مشاريعكم ومحلاتكم التجارية والوصول لشريحة واسعة من المتابعين بأسلوب عصري ومبتكر."}
        </p>
        
        {profile?.ads_contact_url && (
          <a href={profile.ads_contact_url} target="_blank" rel="noreferrer" className={styles.contactBtn}>
            تواصل معنا للإعلان
            <Send size={18} />
          </a>
        )}
      </section>

      {/* Ads Grid */}
      <section className={styles.gridSection}>
        <h2 className={styles.sectionTitle}>شركاء النجاح والأعمال السابقة</h2>
        
        {publishedAds.length === 0 ? (
          <p className={styles.empty}>لم يتم إضافة إعلانات سابقة بعد.</p>
        ) : (
          <div className={styles.grid}>
            {publishedAds.map(s => (
              <div key={s.id} className={styles.card}>
                <div className={styles.imageWrapper}>
                  {s.image_url ? (
                    <Image 
                      src={s.image_url} 
                      alt={s.title || "إعلان"} 
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className={styles.image} 
                    />
                  ) : (
                    <div className={styles.placeholder}>
                      <Megaphone size={48} />
                    </div>
                  )}
                </div>
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{s.title}</h3>
                  {s.description && <p className={styles.cardDesc}>{s.description}</p>}
                  
                  {s.video_url && (
                    <a href={s.video_url} target="_blank" rel="noreferrer" className={styles.watchBtn}>
                      <Play size={18} fill="currentColor" />
                      شاهد فيديو الإعلان
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

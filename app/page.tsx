import { Metadata } from "next";
import HeroSection from "@/components/sections/HeroSection";
import SocialLinksSection from "@/components/sections/SocialLinksSection";
import PostsSection from "@/components/sections/PostsSection";
import GallerySection from "@/components/sections/GallerySection";
import ContactSection from "@/components/sections/ContactSection";
import AdsPreviewSection from "@/components/sections/AdsPreviewSection";
import { getHomeData } from "@/lib/data/public";

export async function generateMetadata(): Promise<Metadata> {
  const { profile } = await getHomeData();
  
  const title = profile?.name || "مصطفى محي | Mostafa Mohy";
  const description = profile?.bio || "صانع محتوى متنوع على فيسبوك | شارك معي لحظات الحياة اليومية والترفيه";
  // Use cover_url if exists, fallback to avatar_url, otherwise no image
  const image = profile?.cover_url || profile?.avatar_url;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      ...(image && {
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
      }),
    },
    twitter: {
      title,
      description,
      ...(image && {
        images: [image],
      }),
    },
  };
}

export default async function Home() {
  const { profile, socialLinks, posts, gallery, sponsorships } = await getHomeData();

  return (
    <div>
      <HeroSection profile={profile} />
      <SocialLinksSection links={socialLinks} />
      <PostsSection posts={posts} preview={true} />
      <GallerySection images={gallery} preview={true} />
      <AdsPreviewSection sponsorships={sponsorships} />
      <ContactSection />
    </div>
  );
}

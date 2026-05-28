import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import HeroSection from "@/components/sections/HeroSection";
import SocialLinksSection from "@/components/sections/SocialLinksSection";
import PostsSection from "@/components/sections/PostsSection";
import GallerySection from "@/components/sections/GallerySection";
import ContactSection from "@/components/sections/ContactSection";
import AdsPreviewSection from "@/components/sections/AdsPreviewSection";

// Revalidate data every 60 seconds (Incremental Static Regeneration)
export const revalidate = 60; 

export default async function Home() {
  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  // Fetch all data concurrently for better performance
  const [
    { data: profile },
    { data: socialLinks },
    { data: posts },
    { data: gallery },
    { data: sponsorships }
  ] = await Promise.all([
    supabase.from("profile").select("*").maybeSingle(),
    supabase.from("social_links").select("*").order("display_order", { ascending: true }),
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
    supabase.from("gallery").select("*").order("display_order", { ascending: true }),
    supabase.from("sponsorships").select("*").order("display_order", { ascending: true }),
  ]);

  return (
    <div>
      <HeroSection profile={profile} />
      <SocialLinksSection links={socialLinks || []} />
      <PostsSection posts={posts || []} preview={true} />
      <GallerySection images={gallery || []} preview={true} />
      <AdsPreviewSection sponsorships={sponsorships || []} />
      <ContactSection />
    </div>
  );
}

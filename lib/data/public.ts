import "server-only";

import { createClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import type { GalleryImage, Post, Profile, SocialLink, Sponsorship } from "@/types";

function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

async function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message);
}

export const getProfile = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase.from("profile").select("*").maybeSingle();
    await throwIfError(error);
    return data as Profile | null;
  },
  [CACHE_TAGS.profile],
  { tags: [CACHE_TAGS.profile, CACHE_TAGS.home] },
);

export const getSocialLinks = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("social_links")
      .select("*")
      .order("display_order", { ascending: true });
    await throwIfError(error);
    return (data || []) as SocialLink[];
  },
  [CACHE_TAGS.socialLinks],
  { tags: [CACHE_TAGS.socialLinks, CACHE_TAGS.home] },
);

export const getPosts = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    await throwIfError(error);
    return (data || []) as Post[];
  },
  [CACHE_TAGS.posts],
  { tags: [CACHE_TAGS.posts, CACHE_TAGS.home] },
);

export const getGallery = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("display_order", { ascending: true });
    await throwIfError(error);
    return (data || []) as GalleryImage[];
  },
  [CACHE_TAGS.gallery],
  { tags: [CACHE_TAGS.gallery, CACHE_TAGS.home] },
);

export const getSponsorships = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("sponsorships")
      .select("*")
      .order("display_order", { ascending: true });
    await throwIfError(error);
    return (data || []) as Sponsorship[];
  },
  [CACHE_TAGS.sponsorships],
  { tags: [CACHE_TAGS.sponsorships, CACHE_TAGS.home] },
);

export const getHomeData = unstable_cache(
  async () => {
    const supabase = createPublicClient();
    const [
      { data: profile, error: profileError },
      { data: socialLinks, error: socialLinksError },
      { data: posts, error: postsError },
      { data: gallery, error: galleryError },
      { data: sponsorships, error: sponsorshipsError },
    ] = await Promise.all([
      supabase.from("profile").select("*").maybeSingle(),
      supabase.from("social_links").select("*").order("display_order", { ascending: true }),
      supabase.from("posts").select("*").order("created_at", { ascending: false }),
      supabase.from("gallery").select("*").order("display_order", { ascending: true }),
      supabase.from("sponsorships").select("*").order("display_order", { ascending: true }),
    ]);

    await Promise.all([
      throwIfError(profileError),
      throwIfError(socialLinksError),
      throwIfError(postsError),
      throwIfError(galleryError),
      throwIfError(sponsorshipsError),
    ]);

    return {
      profile: profile as Profile | null,
      socialLinks: (socialLinks || []) as SocialLink[],
      posts: (posts || []) as Post[],
      gallery: (gallery || []) as GalleryImage[],
      sponsorships: (sponsorships || []) as Sponsorship[],
    };
  },
  [CACHE_TAGS.home],
  {
    tags: [
      CACHE_TAGS.home,
      CACHE_TAGS.profile,
      CACHE_TAGS.socialLinks,
      CACHE_TAGS.posts,
      CACHE_TAGS.gallery,
      CACHE_TAGS.sponsorships,
    ],
  },
);


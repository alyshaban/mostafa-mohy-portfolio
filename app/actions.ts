"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { createClient } from "@/lib/supabase/server";
import { removeStorageImage } from "@/lib/storage";
import type { GalleryImage, Post, Profile, SocialLink, Sponsorship } from "@/types";

type ActionResult<T = null> = {
  data?: T;
  error?: string;
};

function revalidatePublic(tags: string[], paths: string[]) {
  tags.forEach((tag) => revalidateTag(tag));
  paths.forEach((path) => revalidatePath(path));
}

function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "حدث خطأ غير متوقع";
}

export async function saveProfileAction(
  profile: Partial<Profile>,
): Promise<ActionResult<Profile>> {
  try {
    const supabase = createClient();
    const payload = {
      name: profile.name,
      bio: profile.bio,
      avatar_url: profile.avatar_url,
      avatar_storage_path: profile.avatar_storage_path,
      cover_url: profile.cover_url,
      cover_storage_path: profile.cover_storage_path,
      followers_count: profile.followers_count,
      views_count: profile.views_count,
      likes_count: profile.likes_count,
      videos_count: profile.videos_count,
      ads_description: profile.ads_description,
      ads_contact_url: profile.ads_contact_url,
      updated_at: new Date().toISOString(),
    };

    if (profile.id) {
      const { data: previous } = await supabase
        .from("profile")
        .select("avatar_storage_path, cover_storage_path")
        .eq("id", profile.id)
        .single();

      const { data, error } = await supabase
        .from("profile")
        .update(payload)
        .eq("id", profile.id)
        .select()
        .single();

      if (error) throw error;

      if (
        previous?.avatar_storage_path &&
        previous.avatar_storage_path !== profile.avatar_storage_path
      ) {
        await removeStorageImage(supabase, previous.avatar_storage_path);
      }

      if (
        previous?.cover_storage_path &&
        previous.cover_storage_path !== profile.cover_storage_path
      ) {
        await removeStorageImage(supabase, previous.cover_storage_path);
      }

      revalidatePublic(
        [CACHE_TAGS.profile, CACHE_TAGS.home],
        ["/", "/ads"],
      );

      return { data: data as Profile };
    }

    const { data, error } = await supabase
      .from("profile")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    revalidatePublic(
      [CACHE_TAGS.profile, CACHE_TAGS.home],
      ["/", "/ads"],
    );

    return { data: data as Profile };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function saveSocialLinkAction(
  link: Partial<SocialLink>,
): Promise<ActionResult<SocialLink>> {
  try {
    const supabase = createClient();
    const payload = {
      platform: link.platform,
      url: link.url,
      display_order: link.display_order,
      is_visible: link.is_visible,
    };

    const query = link.id
      ? supabase.from("social_links").update(payload).eq("id", link.id)
      : supabase.from("social_links").insert([payload]);

    const { data, error } = await query.select().single();
    if (error) throw error;

    revalidatePublic(
      [CACHE_TAGS.socialLinks, CACHE_TAGS.home],
      ["/"],
    );

    return { data: data as SocialLink };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function deleteSocialLinkAction(
  id: string,
): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("social_links").delete().eq("id", id);
    if (error) throw error;

    revalidatePublic(
      [CACHE_TAGS.socialLinks, CACHE_TAGS.home],
      ["/"],
    );

    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function saveGalleryImageAction(
  image: Partial<GalleryImage>,
): Promise<ActionResult<GalleryImage>> {
  try {
    const supabase = createClient();
    const payload = {
      image_url: image.image_url,
      image_storage_path: image.image_storage_path,
      caption: image.caption,
      display_order: image.display_order,
      category: image.category || "general",
    };

    if (image.id) {
      const { data: previous } = await supabase
        .from("gallery")
        .select("image_storage_path")
        .eq("id", image.id)
        .single();

      const { data, error } = await supabase
        .from("gallery")
        .update(payload)
        .eq("id", image.id)
        .select()
        .single();

      if (error) throw error;

      if (
        previous?.image_storage_path &&
        previous.image_storage_path !== image.image_storage_path
      ) {
        await removeStorageImage(supabase, previous.image_storage_path);
      }

      revalidatePublic(
        [CACHE_TAGS.gallery, CACHE_TAGS.home],
        ["/", "/gallery"],
      );

      return { data: data as GalleryImage };
    }

    const { data, error } = await supabase
      .from("gallery")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    revalidatePublic(
      [CACHE_TAGS.gallery, CACHE_TAGS.home],
      ["/", "/gallery"],
    );

    return { data: data as GalleryImage };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function deleteGalleryImageAction(
  id: string,
): Promise<ActionResult<{ storageWarning?: string }>> {
  try {
    const supabase = createClient();
    const { data: image } = await supabase
      .from("gallery")
      .select("image_storage_path")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("gallery").delete().eq("id", id);
    if (error) throw error;

    const storageError = await removeStorageImage(supabase, image?.image_storage_path);

    revalidatePublic(
      [CACHE_TAGS.gallery, CACHE_TAGS.home],
      ["/", "/gallery"],
    );

    return {
      data: storageError
        ? { storageWarning: "تعذر حذف الملف من Storage." }
        : undefined,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function savePostAction(post: Partial<Post>): Promise<ActionResult<Post>> {
  try {
    const supabase = createClient();
    const payload = {
      title: post.title,
      description: post.description,
      cover_image: post.cover_image,
      cover_storage_path: post.cover_storage_path,
      facebook_url: post.facebook_url,
      category: post.category || "general",
      is_published: post.is_published,
    };

    if (post.id) {
      const { data: previous } = await supabase
        .from("posts")
        .select("cover_storage_path")
        .eq("id", post.id)
        .single();

      const { data, error } = await supabase
        .from("posts")
        .update(payload)
        .eq("id", post.id)
        .select()
        .single();

      if (error) throw error;

      if (
        previous?.cover_storage_path &&
        previous.cover_storage_path !== post.cover_storage_path
      ) {
        await removeStorageImage(supabase, previous.cover_storage_path);
      }

      revalidatePublic(
        [CACHE_TAGS.posts, CACHE_TAGS.home],
        ["/", "/posts"],
      );

      return { data: data as Post };
    }

    const { data, error } = await supabase
      .from("posts")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    revalidatePublic(
      [CACHE_TAGS.posts, CACHE_TAGS.home],
      ["/", "/posts"],
    );

    return { data: data as Post };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function deletePostAction(
  id: string,
): Promise<ActionResult<{ storageWarning?: string }>> {
  try {
    const supabase = createClient();
    const { data: post } = await supabase
      .from("posts")
      .select("cover_storage_path")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) throw error;

    const storageError = await removeStorageImage(supabase, post?.cover_storage_path);

    revalidatePublic(
      [CACHE_TAGS.posts, CACHE_TAGS.home],
      ["/", "/posts"],
    );

    return {
      data: storageError
        ? { storageWarning: "تعذر حذف صورة الغلاف من Storage." }
        : undefined,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function saveSponsorshipAction(
  sponsorship: Partial<Sponsorship>,
): Promise<ActionResult<Sponsorship>> {
  try {
    const supabase = createClient();
    const payload = {
      title: sponsorship.title,
      description: sponsorship.description,
      image_url: sponsorship.image_url,
      image_storage_path: sponsorship.image_storage_path,
      video_url: sponsorship.video_url,
      display_order: sponsorship.display_order,
      is_published: sponsorship.is_published,
    };

    if (sponsorship.id) {
      const { data: previous } = await supabase
        .from("sponsorships")
        .select("image_storage_path")
        .eq("id", sponsorship.id)
        .single();

      const { data, error } = await supabase
        .from("sponsorships")
        .update(payload)
        .eq("id", sponsorship.id)
        .select()
        .single();

      if (error) throw error;

      if (
        previous?.image_storage_path &&
        previous.image_storage_path !== sponsorship.image_storage_path
      ) {
        await removeStorageImage(supabase, previous.image_storage_path);
      }

      revalidatePublic(
        [CACHE_TAGS.sponsorships, CACHE_TAGS.home],
        ["/", "/ads"],
      );

      return { data: data as Sponsorship };
    }

    const { data, error } = await supabase
      .from("sponsorships")
      .insert([payload])
      .select()
      .single();

    if (error) throw error;

    revalidatePublic(
      [CACHE_TAGS.sponsorships, CACHE_TAGS.home],
      ["/", "/ads"],
    );

    return { data: data as Sponsorship };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function deleteSponsorshipAction(
  id: string,
): Promise<ActionResult<{ storageWarning?: string }>> {
  try {
    const supabase = createClient();
    const { data: sponsorship } = await supabase
      .from("sponsorships")
      .select("image_storage_path")
      .eq("id", id)
      .single();

    const { error } = await supabase.from("sponsorships").delete().eq("id", id);
    if (error) throw error;

    const storageError = await removeStorageImage(
      supabase,
      sponsorship?.image_storage_path,
    );

    revalidatePublic(
      [CACHE_TAGS.sponsorships, CACHE_TAGS.home],
      ["/", "/ads"],
    );

    return {
      data: storageError
        ? { storageWarning: "تعذر حذف ملف الصورة من Storage." }
        : undefined,
    };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function toggleSponsorshipPublishAction(
  id: string,
  currentStatus: boolean,
): Promise<ActionResult<Sponsorship>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("sponsorships")
      .update({ is_published: !currentStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePublic(
      [CACHE_TAGS.sponsorships, CACHE_TAGS.home],
      ["/", "/ads"],
    );

    return { data: data as Sponsorship };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function togglePostPublishAction(
  id: string,
  currentStatus: boolean,
): Promise<ActionResult<Post>> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("posts")
      .update({ is_published: !currentStatus })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePublic(
      [CACHE_TAGS.posts, CACHE_TAGS.home],
      ["/", "/posts"],
    );

    return { data: data as Post };
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function submitContactMessageAction(input: {
  name: string;
  email: string;
  message: string;
}): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("contacts").insert([input]);
    if (error) throw error;

    revalidatePublic([CACHE_TAGS.contacts], []);

    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function markContactReadAction(
  id: string,
  currentStatus: boolean,
): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("contacts")
      .update({ is_read: !currentStatus })
      .eq("id", id);
    if (error) throw error;

    revalidatePublic([CACHE_TAGS.contacts], []);

    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

export async function deleteContactMessageAction(id: string): Promise<ActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) throw error;

    revalidatePublic([CACHE_TAGS.contacts], []);

    return {};
  } catch (error) {
    return { error: getErrorMessage(error) };
  }
}

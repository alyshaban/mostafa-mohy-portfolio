export type Profile = {
  id: string;
  name: string;
  bio: string;
  avatar_url: string;
  cover_url: string;
  avatar_storage_path: string | null;
  cover_storage_path: string | null;
  followers_count: number;
  views_count: number;
  likes_count: number;
  videos_count: number;
  updated_at: string;
  ads_description: string | null;
  ads_contact_url: string | null;
};

export type SocialLink = {
  id: string;
  platform: string;
  url: string;
  display_order: number;
  is_visible: boolean;
  created_at: string;
};

export type Post = {
  id: string;
  title: string;
  description: string;
  cover_image: string;
  cover_storage_path: string | null;
  facebook_url: string;
  category: string;
  is_published: boolean;
  created_at: string;
};

export type GalleryImage = {
  id: string;
  image_url: string;
  image_storage_path: string | null;
  caption: string;
  category: string;
  display_order: number;
  created_at: string;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type Sponsorship = {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  image_storage_path: string | null;
  video_url: string | null;
  display_order: number;
  is_published: boolean;
  created_at: string;
};

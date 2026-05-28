import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import PostsSection from "@/components/sections/PostsSection";

export const revalidate = 60;

export default async function PostsPage() {
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

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ paddingTop: "60px", minHeight: "80vh" }}>
      <PostsSection posts={posts || []} preview={false} />
    </div>
  );
}

import PostsSection from "@/components/sections/PostsSection";
import { getPosts } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <div style={{ paddingTop: "60px", minHeight: "80vh" }}>
      <PostsSection posts={posts} preview={false} />
    </div>
  );
}

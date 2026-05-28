import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: post } = await supabase.from("posts").select("*").eq("id", params.id).single();

  if (!post) {
    notFound();
  }

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "2rem" }}>
        تعديل البوست
      </h1>
      <PostForm initialPost={post} />
    </div>
  );
}

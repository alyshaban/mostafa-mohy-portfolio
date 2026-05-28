import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Plus } from "lucide-react";
import PostsList from "@/components/admin/PostsList";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const supabase = createClient();
  const { data } = await supabase.from("posts").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)" }}>إدارة المحتوى (البوستات)</h1>
        <Link 
          href="/admin/posts/new" 
          style={{ background: "var(--accent)", color: "white", padding: "0.8rem 1.2rem", borderRadius: "8px", display: "flex", alignItems: "center", gap: "0.5rem", fontWeight: "600" }}
        >
          <Plus size={18} />
          إضافة بوست
        </Link>
      </div>
      <PostsList initialPosts={data || []} />
    </div>
  );
}

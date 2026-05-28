import { createClient } from "@/lib/supabase/server";
import GalleryManager from "@/components/admin/GalleryManager";

export const dynamic = "force-dynamic";

export default async function AdminGalleryPage() {
  const supabase = createClient();
  const { data } = await supabase.from("gallery").select("*").order("display_order", { ascending: true });

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "2rem" }}>
        إدارة معرض الصور
      </h1>
      <GalleryManager initialImages={data || []} />
    </div>
  );
}

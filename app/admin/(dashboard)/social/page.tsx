import { createClient } from "@/lib/supabase/server";
import SocialLinksManager from "@/components/admin/SocialLinksManager";

export const dynamic = "force-dynamic";

export default async function AdminSocialPage() {
  const supabase = createClient();
  const { data } = await supabase.from("social_links").select("*").order("display_order", { ascending: true });

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "2rem" }}>
        إدارة روابط السوشيال ميديا
      </h1>
      <SocialLinksManager initialLinks={data || []} />
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import SponsorshipsManager from "@/components/admin/SponsorshipsManager";

export const dynamic = "force-dynamic";

export default async function SponsorshipsAdminPage() {
  const supabase = createClient();
  const { data: sponsorships } = await supabase
    .from("sponsorships")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", color: "var(--text-primary)" }}>إدارة الإعلانات والرعايات</h1>
        <p style={{ color: "var(--text-secondary)" }}>أضف إعلانات المحلات والمشاريع التي قمت بتغطيتها لتظهر في قسم شركاء النجاح</p>
      </div>

      <SponsorshipsManager initialSponsorships={sponsorships || []} />
    </div>
  );
}

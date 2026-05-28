import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import SponsorshipsManager from "@/components/admin/SponsorshipsManager";

export const revalidate = 0;

export default async function SponsorshipsAdminPage() {
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

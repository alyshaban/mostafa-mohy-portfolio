import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import SocialLinksManager from "@/components/admin/SocialLinksManager";

export default async function AdminSocialPage() {
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

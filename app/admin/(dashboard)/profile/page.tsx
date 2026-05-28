import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ProfileForm from "@/components/admin/ProfileForm";

export default async function AdminProfilePage() {
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

  const { data } = await supabase.from("profile").select("*").single();

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "2rem" }}>
        إدارة الملف الشخصي
      </h1>
      <ProfileForm initialProfile={data} />
    </div>
  );
}

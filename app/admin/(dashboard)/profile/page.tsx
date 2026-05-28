import { createClient } from "@/lib/supabase/server";
import ProfileForm from "@/components/admin/ProfileForm";

export const dynamic = "force-dynamic";

export default async function AdminProfilePage() {
  const supabase = createClient();
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

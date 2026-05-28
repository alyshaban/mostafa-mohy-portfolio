import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import ContactsManager from "@/components/admin/ContactsManager";

export default async function AdminContactsPage() {
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

  const { data } = await supabase.from("contacts").select("*").order("created_at", { ascending: false });

  return (
    <div>
      <h1 style={{ fontSize: "1.8rem", color: "var(--text-primary)", marginBottom: "2rem" }}>
        رسائل التواصل
      </h1>
      <ContactsManager initialContacts={data || []} />
    </div>
  );
}

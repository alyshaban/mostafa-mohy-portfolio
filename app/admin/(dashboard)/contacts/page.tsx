import { createClient } from "@/lib/supabase/server";
import ContactsManager from "@/components/admin/ContactsManager";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  const supabase = createClient();
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

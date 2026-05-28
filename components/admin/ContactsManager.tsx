"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import { ContactMessage } from "@/types";
import { Trash2, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";
import { useDialog } from "@/components/ui/DialogProvider";

export default function ContactsManager({ initialContacts }: { initialContacts: ContactMessage[] }) {
  const [contacts, setContacts] = useState<ContactMessage[]>(initialContacts);
  const { showToast } = useToast();
  const { confirm } = useDialog();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const handleMarkAsRead = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("contacts").update({ is_read: !currentStatus }).eq("id", id);
    if (error) {
      showToast({ title: "تعذر تحديث الرسالة", description: error.message, type: "error" });
    } else {
      setContacts(contacts.map(c => c.id === id ? { ...c, is_read: !currentStatus } : c));
      showToast({
        title: currentStatus ? "تم تحديد الرسالة كغير مقروءة" : "تم تحديد الرسالة كمقروءة",
        type: "success",
      });
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirm({
      title: "حذف الرسالة؟",
      description: "سيتم حذف رسالة التواصل نهائيًا من لوحة الإدارة.",
      confirmText: "حذف",
      tone: "danger",
    });
    if (!confirmed) return;
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) {
      showToast({ title: "تعذر حذف الرسالة", description: error.message, type: "error" });
    } else {
      setContacts(contacts.filter(c => c.id !== id));
      showToast({ title: "تم حذف الرسالة", type: "success" });
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {contacts.map(contact => (
        <div 
          key={contact.id} 
          style={{ 
            padding: "1.5rem", 
            background: "var(--bg-card)", 
            border: `1px solid ${contact.is_read ? 'var(--border)' : 'var(--accent)'}`, 
            borderRadius: "12px",
            opacity: contact.is_read ? 0.7 : 1
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
            <div>
              <h3 style={{ color: "var(--text-primary)", marginBottom: "0.2rem" }}>{contact.name}</h3>
              <a href={`mailto:${contact.email}`} style={{ color: "var(--accent)", fontSize: "0.9rem" }}>{contact.email}</a>
            </div>
            <div style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              {new Date(contact.created_at).toLocaleDateString('ar-EG')}
            </div>
          </div>
          
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.5rem", whiteSpace: "pre-wrap" }}>
            {contact.message}
          </p>
          
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button 
              onClick={() => handleMarkAsRead(contact.id, contact.is_read)} 
              style={{ padding: "0.5rem 1rem", background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border)", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <CheckCircle size={16} color={contact.is_read ? "gray" : "var(--accent)"} />
              {contact.is_read ? "تحديد كغير مقروءة" : "تحديد كمقروءة"}
            </button>
            <button 
              onClick={() => handleDelete(contact.id)} 
              style={{ padding: "0.5rem 1rem", background: "rgba(255, 101, 132, 0.1)", color: "var(--accent-2)", border: "none", borderRadius: "8px", cursor: "pointer", display: "flex", alignItems: "center", gap: "0.5rem" }}
            >
              <Trash2 size={16} />
              حذف
            </button>
          </div>
        </div>
      ))}
      {contacts.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-secondary)", background: "var(--bg-card)", borderRadius: "12px", border: "1px solid var(--border)" }}>
          لا توجد رسائل جديدة
        </div>
      )}
    </div>
  );
}

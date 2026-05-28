"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import styles from "./ContactSection.module.css";
import { Send } from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ text: "", type: "" });
  const { showToast } = useToast();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ text: "", type: "" });

    const { error } = await supabase
      .from("contacts")
      .insert([{ name, email, message }]);

    if (error) {
      showToast({
        title: "تعذر إرسال الرسالة",
        description: "حدث خطأ أثناء إرسال الرسالة، حاول مرة أخرى.",
        type: "error",
      });
      setStatus({
        text: "حدث خطأ أثناء إرسال الرسالة، حاول مرة أخرى.",
        type: "error",
      });
    } else {
      showToast({
        title: "تم إرسال الرسالة",
        description: "شكراً لتواصلك، سيتم الرد عليك قريباً.",
        type: "success",
      });
      setStatus({
        text: "تم إرسال رسالتك بنجاح! شكراً لتواصلك.",
        type: "success",
      });
      setName("");
      setEmail("");
      setMessage("");
    }
    setLoading(false);
  };

  return (
    <section className={styles.section} id="contact">
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.title}>تواصل معي</h2>
          <p className={styles.subtitle}>
            يسعدني دائماً سماع رأيك أو الإجابة على استفساراتك.
          </p>

          <form onSubmit={handleSubmit} className={styles.form}>
            {status.text && (
              <div className={`${styles.statusMessage} ${styles[status.type]}`}>
                {status.text}
              </div>
            )}
            <div className={styles.inputGroup}>
              <label>الاسم</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="أدخل اسمك"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>البريد || الهاتف</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="أدخل بريدك او رقم هاتفك"
              />
            </div>
            <div className={styles.inputGroup}>
              <label>الرسالة</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                rows={5}
                placeholder="كيف يمكنني مساعدتك؟"
              ></textarea>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? (
                "جاري الإرسال..."
              ) : (
                <>
                  <Send size={18} />
                  إرسال الرسالة
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

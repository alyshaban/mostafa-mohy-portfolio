import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import GallerySection from "@/components/sections/GallerySection";

export const revalidate = 60;

export default async function GalleryPage() {
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

  const { data: gallery } = await supabase
    .from("gallery")
    .select("*")
    .order("display_order", { ascending: true });

  return (
    <div style={{ paddingTop: "60px", minHeight: "80vh" }}>
      <GallerySection images={gallery || []} preview={false} />
    </div>
  );
}

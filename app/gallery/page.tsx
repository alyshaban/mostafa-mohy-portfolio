import GallerySection from "@/components/sections/GallerySection";
import { getGallery } from "@/lib/data/public";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const gallery = await getGallery();

  return (
    <div style={{ paddingTop: "60px", minHeight: "80vh" }}>
      <GallerySection images={gallery} preview={false} />
    </div>
  );
}

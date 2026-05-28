"use client";

import Image from "next/image";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { X, ZoomIn } from "lucide-react";
import styles from "./ImageViewerProvider.module.css";

type ImageViewerInput = {
  src: string;
  alt?: string;
  title?: string;
};

const ImageViewerContext = createContext<{
  openImage: (image: ImageViewerInput) => void;
} | null>(null);

export function ImageViewerProvider({ children }: { children: React.ReactNode }) {
  const [image, setImage] = useState<ImageViewerInput | null>(null);

  const closeImage = useCallback(() => setImage(null), []);
  const openImage = useCallback((nextImage: ImageViewerInput) => {
    if (!nextImage.src) return;
    setImage(nextImage);
  }, []);

  useEffect(() => {
    if (!image) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeImage();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeImage, image]);

  const value = useMemo(() => ({ openImage }), [openImage]);

  return (
    <ImageViewerContext.Provider value={value}>
      {children}
      {image && (
        <div className={styles.backdrop} onClick={closeImage}>
          <div className={styles.viewer} onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className={styles.close}
              onClick={closeImage}
              aria-label="إغلاق عارض الصور"
            >
              <X size={20} />
            </button>

            <div className={styles.imageWrap}>
              <Image
                src={image.src}
                alt={image.alt || image.title || "صورة"}
                fill
                sizes="100vw"
                className={styles.image}
                priority
              />
            </div>

            {(image.title || image.alt) && (
              <div className={styles.caption}>{image.title || image.alt}</div>
            )}
          </div>
        </div>
      )}
    </ImageViewerContext.Provider>
  );
}

export function useImageViewer() {
  const context = useContext(ImageViewerContext);

  if (!context) {
    throw new Error("useImageViewer must be used inside ImageViewerProvider");
  }

  return context;
}

export function ViewableImageButton({
  src,
  alt,
  title,
  className,
}: ImageViewerInput & { className?: string }) {
  const { openImage } = useImageViewer();

  if (!src) return null;

  return (
    <button
      type="button"
      className={`${styles.viewButton} ${className || ""}`}
      onClick={() => openImage({ src, alt, title })}
      aria-label="عرض الصورة"
      title="عرض الصورة"
    >
      <ZoomIn size={16} />
    </button>
  );
}

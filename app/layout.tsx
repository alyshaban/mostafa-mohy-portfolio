import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { DialogProvider } from "@/components/ui/DialogProvider";
import { ImageViewerProvider } from "@/components/ui/ImageViewerProvider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://mostafamohy.vercel.app"),
  title: {
    default: "مصطفى محي | Mostafa Mohy",
    template: "%s | مصطفى محي",
  },
  description: "صانع محتوى متنوع على فيسبوك | شارك معي لحظات الحياة اليومية والترفيه",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://mostafamohy.vercel.app",
    siteName: "Mostafa Mohy - مصطفى محي",
  },
  twitter: {
    card: "summary_large_image",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" data-theme="dark">
      <body className={cairo.variable}>
        <ToastProvider>
          <DialogProvider>
            <ImageViewerProvider>
              <Navbar />
              <main>{children}</main>
              <Footer />
            </ImageViewerProvider>
          </DialogProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

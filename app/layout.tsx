import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "@/styles/globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ToastProvider } from "@/components/ui/ToastProvider";
import { DialogProvider } from "@/components/ui/DialogProvider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "مصطفى محي | Mostafa Mohy",
  description: "صانع محتوى متنوع على فيسبوك | شارك معي لحظات الحياة اليومية والترفيه",
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
            <Navbar />
            <main>{children}</main>
            <Footer />
          </DialogProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

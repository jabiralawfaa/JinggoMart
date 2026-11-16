import type { Metadata } from "next";
import "./globals.css";
import SvgDefs from "@/components/SvgDefs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";

export const metadata: Metadata = {
  title: "JinggoMart — Katalog Produk UMKM Banyuwangi",
  description:
    "JinggoMart: katalog & dashboard produk UMKM Banyuwangi untuk admin, seller, dan pembeli. Salam Kuntul Barong!",
};

// Terapkan tema sebelum render untuk mencegah kilatan tema yang salah.
const themeInit = `(function(){try{var t=localStorage.getItem('jinggomart_theme')}catch(e){}if(t!=='dark'&&t!=='light'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}document.documentElement.dataset.theme=t})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <SvgDefs />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}

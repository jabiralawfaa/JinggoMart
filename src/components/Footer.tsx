import Link from "next/link";
import { WA_DISPLAY, WA_NUMBER } from "@/lib/constants";
import Logo from "./Logo";
import BuyerGateLink from "./BuyerGateLink";

export default function Footer() {
  return (
    <footer>
      <div className="foot-grid">
        <div className="foot-cols">
          <div>
            <h4>Belanja</h4>
            <Link className="flink" href="/?kategori=Makanan#koleksi">
              Makanan
            </Link>
            <Link className="flink" href="/?kategori=Minuman#koleksi">
              Minuman
            </Link>
            <Link className="flink" href="/?kategori=Kerajinan#koleksi">
              Kerajinan
            </Link>
            <Link className="flink" href="/?kategori=all#koleksi">
              Semua produk
            </Link>
          </div>
          <div>
            <h4>Jelajahi</h4>
            <Link className="flink" href="/#top">
              Beranda
            </Link>
            <Link className="flink" href="/#koleksi">
              Koleksi
            </Link>
            <Link className="flink" href="/#cerita">
              Cerita
            </Link>
            <Link className="flink" href="/dashboard">
              Dashboard
            </Link>
          </div>
          <div>
            <h4>Hubungi</h4>
            <BuyerGateLink
              className="flink"
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp toko
            </BuyerGateLink>
            <span className="flink">Banyuwangi, Jawa Timur</span>
          </div>
        </div>
        <div className="foot-cta">
          <Logo className="logo flogo" />
          <h3>Ngobrol yuk</h3>
          <p>Tanya stok atau pesan langsung ke pemilik toko lewat WhatsApp.</p>
          <div className="foot-row">
            <span>{WA_DISPLAY}</span>
            <BuyerGateLink
              href={`https://wa.me/${WA_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat WhatsApp
            </BuyerGateLink>
          </div>
        </div>
      </div>
      <div className="foot-bottom">
        <span>
          <strong>JinggoMart</strong> · Salam Kuntul Barong! Katalog &amp; dashboard
          UMKM Banyuwangi (admin · seller · pembeli).
        </span>
        <span>© 2026 JinggoMart</span>
      </div>
    </footer>
  );
}
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toProductDTO } from "@/lib/products";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import Catalog from "@/components/Catalog";

export const dynamic = "force-dynamic";

const BG_TYPE = "JinggoMart Banyuwangi JinggoMart Banyuwangi JinggoMart";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ kategori?: string }>;
}) {
  const { kategori } = await searchParams;

  const products = await prisma.product.findMany({
    include: { seller: { select: { nama: true } } },
    orderBy: { updatedAt: "desc" },
  });
  const dtos = products.map(toProductDTO);

  return (
    <div className="page">
      <Hero />
      <Marquee products={dtos} />

      <p className="intro">
        Jelajahi olèh-olèh, minuman, dan kerajinan pilihan UMKM Banyuwangi,
        semuanya bisa dipesan langsung lewat WhatsApp
        <span className="rule" />
        <svg className="fl" aria-hidden="true">
          <use href="#fl" />
        </svg>
      </p>

      <Catalog products={dtos} initialKategori={kategori || "all"} />

      {/* Banner ungu */}
      <div className="section banner" aria-label="Ajakan belanja">
        <div className="bgtype" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>{BG_TYPE}</span>
          ))}
        </div>
        <svg
          className="art"
          viewBox="0 0 900 420"
          preserveAspectRatio="xMidYMax meet"
          aria-hidden="true"
        >
          <ellipse cx="450" cy="235" rx="190" ry="175" fill="none" stroke="#fff" strokeWidth="3" />
          <text
            x="190"
            y="150"
            fontSize="56"
            fill="#fff"
            fontFamily="'Segoe Script','Bradley Hand','Comic Sans MS',cursive"
            transform="rotate(-16 190 150)"
          >
            NEW!
          </text>
          <use href="#art-batik" x="165" y="183" width="190" height="237" />
          <use href="#art-cup" x="545" y="183" width="190" height="237" />
          <use href="#art-kuntul" x="323" y="93" width="254" height="327" />
        </svg>
        <a className="banner-btn" href="#koleksi">
          Gas belanja
        </a>
      </div>

      {/* Cerita */}
      <div id="cerita" className="section story">
        <div>
          <h2 className="story-title">
            Rasa adalah cara bilang dari mana kamu berasal, tanpa harus bicara
            <span className="rule" />
            <svg className="fl" aria-hidden="true">
              <use href="#fl" />
            </svg>
          </h2>
          <Link className="pill-dark" href="/?kategori=all#koleksi">
            Gas Belanja
          </Link>
          <div className="story-row">
            <div className="tile">
              <svg viewBox="0 0 140 140" width="140" height="140" aria-hidden="true">
                <use href="#art-batik" x="15" y="20" width="110" height="137" />
              </svg>
            </div>
            <div className="blackcard">
              <span className="chip-w">#JinggoMart</span>
              <p>
                Pesan lewat WhatsApp, langsung dilayani pemilik toko.{" "}
                <b>#SalamKuntulBarong</b>
              </p>
            </div>
          </div>
        </div>
        <div>
          <div className="orange-panel">
            <svg viewBox="0 0 420 260" aria-hidden="true">
              <use href="#art-batik" x="40" y="120" width="112" height="140" />
              <use href="#art-cup" x="268" y="104" width="120" height="150" />
              <use href="#art-kuntul" x="130" y="60" width="160" height="200" />
            </svg>
          </div>
          <blockquote>
            “Dari dapur Osing ke tanganmu.”
            <span>Salam Kuntul Barong!</span>
          </blockquote>
        </div>
      </div>
    </div>
  );
}

type MarqueeProduct = { id: string; nama: string; kategori: string };

const SWATCH = ["#FFD83D", "#8FDDD2", "#F9A8D4", "#FF6B1A", "#B8A9FF"];

export default function Marquee({ products }: { products: MarqueeProduct[] }) {
  if (products.length === 0) return null;

  const items = products.map((p, i) => (
    <span className="m-item" key={p.id}>
      <span className="m-thumb" style={{ background: SWATCH[i % SWATCH.length] }} />
      {p.nama} <small>{p.kategori}</small>
    </span>
  ));

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {items}
        {items}
      </div>
    </div>
  );
}

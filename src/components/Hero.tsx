import Link from "next/link";

const BG_TYPE = "JinggoMart Banyuwangi JinggoMart Banyuwangi JinggoMart";

function Bird({
  className,
  width,
  height,
}: {
  className: string;
  width: number;
  height: number;
}) {
  return (
    <svg
      className={className}
      width={width}
      height={height}
      viewBox="0 0 44 22"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M 2 16 Q 11 4 22 16 Q 33 4 42 16"
        fill="none"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Hero() {
  return (
    <section id="top" className="hero" aria-label="Sapaan">
      <div className="hero-bg">
        <div className="bgtype" aria-hidden="true">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i}>{BG_TYPE}</span>
          ))}
        </div>
        <div className="blob" />
        <Bird className="bird bird-1" width={44} height={22} />
        <Bird className="bird bird-2" width={34} height={17} />
        <Bird className="bird bird-3" width={54} height={27} />
      </div>

      <div className="hero-content">
        <span className="hero-badge">Banyuwangi × Gen Z</span>
        <h1 className="hero-title">
          <span className="hero-greet">
            <span className="nowrap">
              Salam{" "}
              <svg className="fl" aria-hidden="true">
                <use href="#fl" />
              </svg>
            </span>
            Kuntul <u>Barong!</u>
          </span>
          <span className="hero-sub">
            Olèh-olèh khas Banyuwangi, <em>gas</em> belanja!
          </span>
        </h1>
        <p className="hero-desc">
          Matur nuwun teka ring JinggoMart. Dari Nasi Jinggo sampai Batik Gajah
          Oling — semua bisa pesan via WhatsApp. Santai, nggak ribet.
        </p>
        <div className="hero-cta">
          <a className="btn-gas" href="#koleksi">
            Gas Belanja ↓
          </a>
          <Link className="btn-outline-dark" href="/dashboard">
            Buka Dashboard
          </Link>
        </div>
      </div>

      <svg
        className="hero-art"
        viewBox="0 0 560 400"
        preserveAspectRatio="xMidYMax meet"
        aria-hidden="true"
      >
        <circle
          className="ring"
          cx="285"
          cy="215"
          r="178"
          fill="none"
          stroke="#FFE45C"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray="820 300"
        />
        <use href="#art-batik" x="40" y="214" width="150" height="186" />
        <use href="#art-cup" x="390" y="200" width="160" height="200" />
        <use href="#art-kuntul" x="170" y="100" width="230" height="300" />
      </svg>
    </section>
  );
}

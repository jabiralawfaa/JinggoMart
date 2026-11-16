// Definisi SVG shared (logo bunga + ilustrasi arch bertema Banyuwangi).
// Dirender sekali di layout; elemen lain memakainya lewat <use href="#...">.
export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
      <defs>
        <symbol id="fl" viewBox="0 0 24 24">
          <ellipse cx="12" cy="12" rx="3.2" ry="11" />
          <ellipse cx="12" cy="12" rx="3.2" ry="11" transform="rotate(60 12 12)" />
          <ellipse cx="12" cy="12" rx="3.2" ry="11" transform="rotate(120 12 12)" />
        </symbol>
        <g id="r3" fill="none" stroke="#1B2A8F" strokeWidth="5" opacity=".85">
          <circle r="28" />
          <circle r="17" />
          <circle r="6" fill="#1B2A8F" />
        </g>
        <symbol id="art-kuntul" viewBox="0 0 260 340">
          <clipPath id="ck">
            <path d="M0 340V130A130 130 0 0 1 260 130V340Z" />
          </clipPath>
          <path d="M0 340V130A130 130 0 0 1 260 130V340Z" fill="#FFD83D" />
          <g clipPath="url(#ck)">
            <use href="#r3" x="30" y="60" />
            <use href="#r3" x="230" y="60" />
            <use href="#r3" x="130" y="12" />
            <use href="#r3" x="30" y="300" />
            <use href="#r3" x="230" y="300" />
            <use href="#r3" x="130" y="325" />
          </g>
          <circle cx="130" cy="175" r="96" fill="#1B2A8F" />
          <g transform="translate(0 15)">
            <ellipse cx="138" cy="178" rx="44" ry="22" transform="rotate(-10 138 178)" fill="#fff" />
            <path d="M176 172L218 190L174 196Z" fill="#fff" />
            <path d="M116 172C88 152 124 122 106 84" fill="none" stroke="#fff" strokeWidth="12" strokeLinecap="round" />
            <circle cx="106" cy="80" r="11" fill="#fff" />
            <path d="M97 76L64 84L97 89Z" fill="#FFB020" />
            <circle cx="103" cy="77" r="2.4" fill="#1B2A8F" />
            <path d="M112 176Q140 196 176 182" fill="none" stroke="#C7D0FF" strokeWidth="3" />
            <path d="M132 198L128 236M148 198L150 236" stroke="#FFB020" strokeWidth="4" strokeLinecap="round" />
          </g>
        </symbol>
        <symbol id="art-cup" viewBox="0 0 200 250">
          <clipPath id="cc">
            <path d="M0 250V100A100 100 0 0 1 200 100V250Z" />
          </clipPath>
          <path d="M0 250V100A100 100 0 0 1 200 100V250Z" fill="#8FDDD2" />
          <g clipPath="url(#cc)" fill="none" stroke="#1B2A8F" strokeWidth="4" opacity=".5">
            <circle cx="28" cy="50" r="16" />
            <circle cx="172" cy="50" r="16" />
            <circle cx="24" cy="225" r="16" />
            <circle cx="176" cy="225" r="16" />
          </g>
          <circle cx="100" cy="150" r="70" fill="#1B2A8F" />
          <path d="M60 125H132V165Q132 197 96 197Q60 197 60 165Z" fill="#fff" />
          <path d="M132 135Q158 138 155 160Q152 178 130 178" fill="none" stroke="#fff" strokeWidth="7" />
          <ellipse cx="96" cy="206" rx="52" ry="7" fill="#fff" opacity=".7" />
          <path d="M78 110Q70 98 80 88M96 110Q88 98 98 88M114 110Q106 98 116 88" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity=".8" />
        </symbol>
        <symbol id="art-batik" viewBox="0 0 200 250">
          <clipPath id="cb">
            <path d="M0 250V100A100 100 0 0 1 200 100V250Z" />
          </clipPath>
          <path d="M0 250V100A100 100 0 0 1 200 100V250Z" fill="#F9A8D4" />
          <g clipPath="url(#cb)">
            <use href="#r3" x="26" y="48" />
            <use href="#r3" x="174" y="48" />
            <use href="#r3" x="26" y="226" />
            <use href="#r3" x="174" y="226" />
          </g>
          <circle cx="100" cy="150" r="70" fill="#1B2A8F" />
          <g fill="none" stroke="#fff" strokeWidth="6">
            <circle cx="100" cy="150" r="52" />
            <circle cx="100" cy="150" r="35" />
            <circle cx="100" cy="150" r="18" />
          </g>
          <circle cx="100" cy="150" r="6" fill="#FFD83D" />
        </symbol>
      </defs>
    </svg>
  );
}

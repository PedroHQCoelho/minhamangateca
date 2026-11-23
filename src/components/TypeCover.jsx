// src/components/TypeCover.jsx
//
// Capa tipográfica: quando não há imagem de capa, o título vira o logotipo
// da capa, em letras condensadas e com uma cor fixa para cada título.
// As cores vêm das capas reais da coleção.

const COVER_COLORS = [
  "#C2185B",
  "#1E6BB8",
  "#2A9DB5",
  "#E8B93A",
  "#563D6D",
  "#B03A48",
  "#2E6B4F",
  "#D9722B",
];

// A mesma cor para o mesmo título, sempre.
// Hash FNV-1a: títulos parecidos recebem cores bem diferentes.
export function coverColorFor(title) {
  let hash = 2166136261;

  for (const char of title) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }

  hash ^= hash >>> 15;
  hash = Math.imul(hash, 2246822507);
  hash ^= hash >>> 13;

  return COVER_COLORS[(hash >>> 0) % COVER_COLORS.length];
}

// Texto escuro sobre cores claras e branco sobre as escuras
function isLight(hex) {
  const [r, g, b] = [1, 3, 5]
    .map((index) => parseInt(hex.slice(index, index + 2), 16) / 255)
    .map((value) =>
      value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
    );

  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.4;
}

// Tamanho da letra em "cqw" (1cqw = 1% da largura da capa), então o texto
// acompanha o tamanho da capa. Palavras longas ganham letra menor para não
// quebrar no meio. 17.5cqw equivale a 14px numa capa de 80px.
function fontSizeFor(title) {
  const longest = Math.max(...title.split(/\s+/).map((word) => word.length));

  if (longest <= 8) return 17.5;
  if (longest === 9) return 15.6;
  if (longest === 10) return 14.4;

  return 13.1;
}

// "color" é opcional (por exemplo, a coverColor do próprio mangá);
// "className" define o tamanho (a proporção é sempre 2:3).
export function TypeCover({ title, color, className = "w-20" }) {
  const background = color ?? coverColorFor(title);

  return (
    <div
      aria-hidden="true"
      className={`flex aspect-[2/3] shrink-0 items-center justify-center
        overflow-hidden rounded-lg px-1.5 py-2 text-center shadow-lg
        ring-1 ring-inset ring-white/20 ${className}`}
      style={{ backgroundColor: background, containerType: "inline-size" }}
    >
      <span
        className="display line-clamp-5 break-words uppercase
          leading-[1.05]"
        style={{
          color: isLight(background) ? "#1a1a1a" : "#fff",
          fontSize: `${fontSizeFor(title)}cqw`,
        }}
      >
        {title}
      </span>
    </div>
  );
}

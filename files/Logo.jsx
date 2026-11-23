// src/components/Logo.jsx
// Marca própria da Minha Mangateca. Substitui o <BookOpen /> do Lucide,
// que também é usado como ícone utilitário em outras telas.
// O fundo acompanha --primary, então funciona nos temas claro e escuro.

// O 漫画 ("manga") nas duas páginas é desenhado em curvas (não depende
// de fonte instalada). Em tamanhos muito pequenos, use kanji={false}.
export function LogoMark({ size = 48, kanji = true, className = "" }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <rect width="64" height="64" rx="14" fill="var(--primary)" />
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M32 18.5c-7-6-15-6-21.5-3v27c6.5-3 14.5-3 21.5 3" />
        <path d="M32 18.5c7-6 15-6 21.5-3v27c-6.5-3-14.5-3-21.5 3" />
      </g>
      <path d="M30 18.5h4V45.5l2 .5v7L32 49.5 28 53v-7l2-.5z" fill="#fff" />

      {kanji && (
        <g fill="#fff">
          <path d="M25.17 29.94L25.8 29.94L25.8 30.63L25.17 30.63ZM23.03 29.94L23.65 29.94L23.65 30.63L23.03 30.63ZM20.89 29.94L21.51 29.94L21.51 30.63L20.89 30.63ZM19.16 28.73L19.16 31.83L27.63 31.83L27.63 28.73ZM21.87 26.88L24.98 26.88L24.98 27.2L21.87 27.2ZM21.87 25.5L24.98 25.5L24.98 25.82L21.87 25.82ZM19.94 24.37L19.94 28.34L27.01 28.34L27.01 24.37ZM15.31 25.72C16.22 26.25 17.43 27.08 17.97 27.64L19.28 26.07C18.67 25.52 17.42 24.77 16.53 24.3ZM14.57 29.37C15.44 29.92 16.61 30.74 17.14 31.31L18.44 29.74C17.85 29.2 16.64 28.45 15.79 27.97ZM14.88 35.9L16.66 37.25C17.45 35.86 18.24 34.36 18.94 32.9L17.39 31.57C16.58 33.18 15.59 34.87 14.88 35.9ZM24.37 33.79C24.05 34.04 23.68 34.27 23.27 34.48C22.86 34.27 22.49 34.04 22.16 33.79ZM18.98 32.2L18.98 33.79L19.71 33.79C20.14 34.34 20.62 34.82 21.16 35.25C20.28 35.49 19.32 35.64 18.31 35.76C18.64 36.18 19.05 36.99 19.22 37.49C20.65 37.26 21.99 36.93 23.18 36.47C24.29 36.96 25.56 37.3 27.01 37.5C27.28 36.98 27.8 36.15 28.23 35.74C27.21 35.64 26.27 35.49 25.42 35.26C26.31 34.61 27.05 33.8 27.58 32.78L26.27 32.13L25.93 32.2Z" />
          <path d="M46.77 26.99L46.77 34.63L38.42 34.63L38.42 26.99L36.33 26.99L36.33 37.5L38.42 37.5L38.42 36.66L46.77 36.66L46.77 37.5L48.85 37.5L48.85 26.99ZM39.08 27.23L39.08 34.03L46.1 34.03L46.1 27.23L43.62 27.23L43.62 26.3L49.33 26.3L49.33 24.3L35.87 24.3L35.87 26.3L41.45 26.3L41.45 27.23ZM40.83 31.42L41.62 31.42L41.62 32.3L40.83 32.3ZM43.46 31.42L44.27 31.42L44.27 32.3L43.46 32.3ZM40.83 28.96L41.62 28.96L41.62 29.81L40.83 29.81ZM43.46 28.96L44.27 28.96L44.27 29.81L43.46 29.81Z" />
        </g>
      )}
    </svg>
  );
}

export function Logo({ size = 48 }) {
  return (
    <div className="flex items-center gap-3">
      <LogoMark size={size} />

      {/* Um único bloco de texto: o <h1> da página fica com a tela */}
      <p className="leading-none">
        <span className="block text-[13px] font-medium text-muted">
          Minha
        </span>
        <span className="display mt-1 block text-[28px] text-foreground">
          Mangateca
        </span>
      </p>
    </div>
  );
}

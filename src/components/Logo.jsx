// src/components/Logo.jsx
// Marca própria da Minha Mangateca. Substitui o <BookOpen /> do Lucide,
// que também é usado como ícone utilitário em outras telas.
// O fundo acompanha --primary, então funciona nos temas claro e escuro.

export function LogoMark({ size = 48, className = "" }) {
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

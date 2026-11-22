// src/components/StatRow.jsx
//
// Números da página em linha, sem cartões nem ícones.
// O número aparece em cima, mas no HTML o rótulo vem primeiro (<dt>),
// que é a ordem certa para leitores de tela.

export function StatRow({ items, className = "" }) {
  return (
    <dl className={`flex flex-wrap gap-x-10 gap-y-6 ${className}`}>
      {items.map((item) => (
        <div
          key={item.label}
          className="flex flex-col-reverse border-l-2
            border-border pl-4"
        >
          <dt className="mt-1 text-sm text-muted">{item.label}</dt>
          <dd className="display text-4xl">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

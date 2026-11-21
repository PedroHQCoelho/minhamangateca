// src/components/VolumeStrip.jsx
//
// Faixa de volumes: um traço por volume. Vermelho = você tem,
// só contorno = falta. Mostra QUAIS volumes faltam, não só quantos.
// Em séries longas (mais de MAX_TICKS volumes) os traços ficariam
// finos demais, então os volumes seguidos viram trechos contínuos.

const MAX_TICKS = 48;

// Volumes que a pessoa tem, sem duplicados e dentro de 1..total.
function normalizeOwned(owned, total) {
  return new Set(
    owned.filter((v) => Number.isInteger(v) && v >= 1 && v <= total)
  );
}

// [1,2,3,7,8,12] -> "1–3, 7–8, 12"
export function formatRanges(numbers) {
  const sorted = [...numbers].sort((a, b) => a - b);
  const parts = [];
  let start = null;
  let prev = null;

  function close() {
    if (start === null) return;
    parts.push(start === prev ? `${start}` : `${start}–${prev}`);
  }

  for (const n of sorted) {
    if (start === null) {
      start = prev = n;
    } else if (n === prev + 1) {
      prev = n;
    } else {
      close();
      start = prev = n;
    }
  }
  close();

  return parts.join(", ");
}

// Lista os volumes que faltam: [5, 6, 7, 12]
export function getMissingVolumes(total, owned) {
  const ownedSet = normalizeOwned(owned, total);
  const missing = [];

  for (let v = 1; v <= total; v++) {
    if (!ownedSet.has(v)) missing.push(v);
  }

  return missing;
}

// Trechos contínuos de volumes que a pessoa tem: [[1,4],[9,12]]
function getOwnedRuns(total, ownedSet) {
  const runs = [];
  let start = null;

  for (let v = 1; v <= total; v++) {
    if (ownedSet.has(v)) {
      if (start === null) start = v;
    } else if (start !== null) {
      runs.push([start, v - 1]);
      start = null;
    }
  }

  if (start !== null) runs.push([start, total]);

  return runs;
}

export function VolumeStrip({ total, owned = [], className = "" }) {
  if (!total || total < 1) return null;

  const ownedSet = normalizeOwned(owned, total);
  const missing = getMissingVolumes(total, owned);

  const label =
    missing.length === 0
      ? `Todos os ${total} volumes adquiridos`
      : `${ownedSet.size} de ${total} volumes adquiridos. ` +
        `Faltam: ${formatRanges(missing)}`;

  // Séries curtas: um traço por volume.
  if (total <= MAX_TICKS) {
    return (
      <div
        role="img"
        aria-label={label}
        className={`flex h-3 gap-[2px] ${className}`}
      >
        {Array.from({ length: total }, (_, index) => {
          const volume = index + 1;

          return (
            <span
              key={volume}
              className={`min-w-0 flex-1 rounded-[2px] ${
                ownedSet.has(volume)
                  ? "bg-primary"
                  : "border border-muted/50"
              }`}
            />
          );
        })}
      </div>
    );
  }

  // Séries longas: trechos contínuos sobre uma trilha.
  const runs = getOwnedRuns(total, ownedSet);

  return (
    <div
      role="img"
      aria-label={label}
      className={`relative h-3 overflow-hidden rounded-[3px]
        bg-secondary ${className}`}
    >
      {runs.map(([start, end]) => (
        <span
          key={start}
          className="absolute inset-y-0 bg-primary"
          style={{
            left: `${((start - 1) / total) * 100}%`,
            width: `${((end - start + 1) / total) * 100}%`,
          }}
        />
      ))}
    </div>
  );
}

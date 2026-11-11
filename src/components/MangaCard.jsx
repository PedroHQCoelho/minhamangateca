import { useEffect, useState } from "react";
import { BookOpen, Pencil, Trash2, Eye } from "lucide-react";
import { getCover } from "../utils/imageStorage";

export function MangaCard({
  id,
  title,
  publisher,
  totalVolumes,
  ownedVolumes,
  coverColor,
  coverLabel,
  coverUpdatedAt,
  onEdit,
  onDelete,
  onView,
}) {
  const owned = ownedVolumes.length;
  const missing = totalVolumes - owned;

  const progress = totalVolumes > 0
    ? Math.round((owned / totalVolumes) * 100)
    : 0;

  const [coverUrl, setCoverUrl] = useState("");

    useEffect(() => {
      let imageUrl = "";
      let cancelled = false;

      async function loadCover() {
        setCoverUrl("");

        try {
          const image = await getCover(id);

          if (image && !cancelled) {
            imageUrl = URL.createObjectURL(image);
            setCoverUrl(imageUrl);
          }
        } catch (error) {
          console.error("Erro ao carregar a capa:", error);
        }
      }

      loadCover();

      return () => {
        cancelled = true;

        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }, [id, coverUpdatedAt]);

  return (
    <article className="overflow-hidden rounded-xl border
      border-border bg-card p-4 transition
      hover:border-primary/60">

      <div className="flex gap-4">

        <div
          className="flex h-36 w-24 shrink-0 items-center
            justify-center overflow-hidden rounded-lg
            text-center shadow-lg"
          style={{ backgroundColor: coverColor }}
        >
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={`Capa de ${title}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-2">
              <BookOpen size={30} className="mb-3 text-white" />
              <span className="text-xs font-bold text-white">
                {coverLabel}
              </span>
            </div>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col">

          <h3 className="text-lg font-bold">
            {title}
          </h3>

          <p className="mt-1 text-sm text-muted">
            {publisher}
          </p>

          <div className="mt-auto">

            <div className="mb-2 flex justify-between text-sm">
              <span className="font-semibold">
                {owned} / {totalVolumes}
              </span>

              <span className="text-muted">
                {progress}%
              </span>
            </div>

            <div className="h-2 overflow-hidden rounded-full
              bg-secondary">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="mt-2 text-xs text-muted">
              {missing === 0
                ? "Coleção completa!"
                : `${missing} volumes faltantes`}
            </p>

          </div>

        </div>
      </div>

      {/* Ações de gerenciamento */}

      {(onEdit || onDelete) && (
        <div className="mt-4 flex justify-end gap-2
          border-t border-border pt-3">

          {onView && (
              <button
                type="button"
                onClick={onView}
                title="Ver detalhes"
                aria-label={`Ver detalhes de ${title}`}
                className="rounded-lg border border-border
                  p-2 text-muted transition
                  hover:border-primary hover:text-primary"
              >
                <Eye size={17} />
              </button>
           )}

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              title="Editar mangá"
              aria-label={`Editar ${title}`}
              className="rounded-lg border border-border
                p-2 text-muted transition
                hover:border-primary hover:text-primary"
            >
              <Pencil size={17} />
            </button>
          )}

          {onDelete && (
            <button
              type="button"
              onClick={onDelete}
              title="Excluir mangá"
              aria-label={`Excluir ${title}`}
              className="rounded-lg border border-border
                p-2 text-muted transition
                hover:border-red-500 hover:text-red-500"
            >
              <Trash2 size={17} />
            </button>
          )}

        </div>
      )}

    </article>
  );
}
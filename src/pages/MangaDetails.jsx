import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getCover } from "../utils/imageStorage";
import { useMangas } from "../context/MangaContext";

import {
  ArrowLeft,
  BookOpen,
  Check,
  Circle,
  Layers,
  Bookmark,
} from "lucide-react";

export function MangaDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { mangas, updateManga } = useMangas();

  const manga = mangas.find((item) => item.id === id);

  // Verifica se o mangá existe
  if (!manga) {
    return (
      <main className="flex-1 px-6 py-8 lg:px-10">
        <h1 className="text-2xl font-bold">
          Mangá não encontrado
        </h1>

        <button
          type="button"
          onClick={() => navigate("/colecao")}
          className="mt-5 inline-flex items-center gap-2
            text-primary hover:opacity-75"
        >
          <ArrowLeft size={18} />
          Voltar para Minha Coleção
        </button>
      </main>
    );
  }

  const ownedVolumes = manga.ownedVolumes || [];

  const totalOwned = ownedVolumes.length;

  const totalMissing = manga.totalVolumes - totalOwned;

  const [coverUrl, setCoverUrl] = useState("");

    useEffect(() => {
      let imageUrl = "";

      async function loadCover() {
        if (!manga?.id) return;

        try {
          const image = await getCover(manga.id);

          if (image) {
            imageUrl = URL.createObjectURL(image);
            setCoverUrl(imageUrl);
          }
        } catch (error) {
          console.error("Erro ao carregar a capa:", error);
        }
      }

      loadCover();

      return () => {
        if (imageUrl) {
          URL.revokeObjectURL(imageUrl);
        }
      };
    }, [manga?.id]);

  const progress = manga.totalVolumes > 0
    ? Math.round((totalOwned / manga.totalVolumes) * 100)
    : 0;

  // Alterna o estado de um volume
  function toggleVolume(volume) {
    const isOwned = ownedVolumes.includes(volume);

    const updatedVolumes = isOwned
      ? ownedVolumes.filter((item) => item !== volume)
      : [...ownedVolumes, volume].sort((a, b) => a - b);

    updateManga(manga.id, {
      ownedVolumes: updatedVolumes,
    });
  }

  // Gera todos os números dos volumes
  const volumes = Array.from(
    { length: manga.totalVolumes },
    (_, index) => index + 1
  );

  return (
    <main className="flex-1 px-6 py-8 lg:px-10">

      {/* Voltar */}

      <button
        type="button"
        onClick={() => navigate("/colecao")}
        className="mb-6 inline-flex items-center gap-2
          text-sm font-medium text-muted
          transition hover:text-primary"
      >
        <ArrowLeft size={18} />
        Voltar para Minha Coleção
      </button>

      {/* Informações do mangá */}

      <section className="mb-8 rounded-xl border
        border-border bg-card p-5 sm:p-6">

        <div className="flex flex-col gap-5 sm:flex-row">

          <div
            className="flex h-40 w-28 shrink-0 items-center
              justify-center overflow-hidden rounded-lg
              text-center shadow-lg"
            style={{ backgroundColor: manga.coverColor }}
          >
            {coverUrl ? (
              <img
                src={coverUrl}
                alt={`Capa de ${manga.title}`}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-3">
                <BookOpen size={36} className="mb-3 text-white" />
                <span className="text-xs font-bold text-white">
                  {manga.coverLabel}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col">

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-2xl font-bold sm:text-3xl">
                {manga.title}
              </h1>

              <span className={`rounded-full px-3 py-1
                text-xs font-medium ${
                  manga.publicationStatus === "completed"
                    ? "bg-green-500/10 text-green-600"
                    : "bg-blue-500/10 text-blue-500"
                }`}>
                {manga.publicationStatus === "completed"
                  ? "Concluído"
                  : "Em publicação"}
              </span>
            </div>

            <p className="mt-2 text-sm text-muted">
              {manga.publisher} · {manga.format}
            </p>

            <div className="mt-auto pt-6">

              <div className="mb-2 flex justify-between text-sm">
                <span className="font-semibold">
                  {totalOwned} / {manga.totalVolumes} volumes
                </span>

                <span className="text-muted">
                  {progress}%
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full
                bg-secondary">
                <div
                  className="h-full rounded-full bg-primary
                    transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

            </div>
          </div>
        </div>

        {/* Indicadores */}

        <div className="mt-6 grid grid-cols-2 gap-3
          border-t border-border pt-5 sm:grid-cols-3">

          <div>
            <div className="flex items-center gap-2 text-muted">
              <Layers size={17} />
              <span className="text-xs">Total publicado</span>
            </div>

            <p className="mt-1 text-xl font-bold">
              {manga.totalVolumes}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted">
              <Check size={17} />
              <span className="text-xs">Adquiridos</span>
            </div>

            <p className="mt-1 text-xl font-bold text-green-600">
              {totalOwned}
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-muted">
              <Bookmark size={17} />
              <span className="text-xs">Faltantes</span>
            </div>

            <p className="mt-1 text-xl font-bold text-primary">
              {totalMissing}
            </p>
          </div>

        </div>

      </section>

      {/* Grade de volumes */}

      <section>

        <div className="mb-5">
          <h2 className="text-xl font-bold">
            Volumes da coleção
          </h2>

          <p className="mt-1 text-sm text-muted">
            Clique em um volume para alterar seu status.
          </p>
        </div>

        {/* Legenda */}

        <div className="mb-5 flex flex-wrap gap-4 text-sm">

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-green-600" />
            <span className="text-muted">Adquirido</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-3 w-3 rounded-sm bg-secondary" />
            <span className="text-muted">Faltante</span>
          </div>

        </div>

        {/* Volumes */}

        <div className="grid grid-cols-3 gap-3
          sm:grid-cols-4 md:grid-cols-5
          lg:grid-cols-6 xl:grid-cols-8">

          {volumes.map((volume) => {
            const isOwned = ownedVolumes.includes(volume);

            return (
              <button
                key={volume}
                type="button"
                onClick={() => toggleVolume(volume)}
                aria-pressed={isOwned}
                aria-label={`Volume ${volume}: ${
                  isOwned ? "adquirido" : "faltante"
                }`}
                className={`flex aspect-square flex-col
                  items-center justify-center rounded-xl
                  border p-3 transition duration-200
                  hover:scale-105 ${
                    isOwned
                      ? "border-green-600 bg-green-600 text-white"
                      : "border-border bg-card text-foreground hover:border-primary"
                  }`}
              >

                <span className="text-2xl font-bold">
                  {volume}
                </span>

                {isOwned ? (
                  <Check size={19} className="mt-1" />
                ) : (
                  <Circle size={19} className="mt-1 text-muted" />
                )}

                <span className="mt-1 text-xs">
                  {isOwned ? "Adquirido" : "Faltante"}
                </span>

              </button>
            );
          })}

        </div>

      </section>

    </main>
  );
}

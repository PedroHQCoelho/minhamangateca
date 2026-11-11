import { useState } from "react";

import {
  Plus,
  Layers,
  BookOpen,
  Bookmark,
  TrendingUp,
} from "lucide-react";

import { MangaCard } from "../components/MangaCard";
import { MangaForm } from "../components/MangaForm";
import { useMangas } from "../context/MangaContext";

export function Dashboard() {
  const { mangas } = useMangas();

  const [isFormOpen, setIsFormOpen] = useState(false);

  // Estatísticas da coleção

  const totalCollections = mangas.length;

  const totalOwned = mangas.reduce(
    (sum, manga) => sum + manga.ownedVolumes.length,
    0
  );

  const totalMissing = mangas.reduce(
    (sum, manga) =>
      sum + manga.totalVolumes - manga.ownedVolumes.length,
    0
  );

  const totalVolumes = totalOwned + totalMissing;

  const progress =
    totalVolumes > 0
      ? Math.round((totalOwned / totalVolumes) * 100)
      : 0;

  const stats = [
    {
      label: "Coleções",
      value: totalCollections,
      icon: Layers,
    },
    {
      label: "Volumes adquiridos",
      value: totalOwned,
      icon: BookOpen,
    },
    {
      label: "Volumes faltantes",
      value: totalMissing,
      icon: Bookmark,
    },
    {
      label: "Progresso da coleção",
      value: `${progress}%`,
      icon: TrendingUp,
    },
  ];

  return (
    <main id="inicio" className="flex-1 px-6 py-8 lg:px-10">

      {/* Cabeçalho do Dashboard */}

      <section className="mb-8 flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-2xl font-bold sm:text-3xl">
            Bem-vindo à sua Mangateca!
          </h1>

          <p className="mt-2 text-sm text-muted">
            Organize suas coleções e acompanhe seu progresso.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center justify-center
            gap-2 rounded-lg bg-primary px-5 py-3
            font-semibold text-white transition
            hover:opacity-90"
        >
          <Plus size={20} />
          Adicionar mangá
        </button>

      </section>

      {/* Indicadores */}

      <section className="mb-10 grid grid-cols-1 gap-4
        sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-xl border border-border
                bg-card p-5"
            >
              <div className="mb-4 flex items-center
                justify-between">

                <div className="rounded-lg bg-primary/15 p-3
                  text-primary">
                  <Icon size={23} />
                </div>

              </div>

              <p className="text-3xl font-bold">
                {stat.value}
              </p>

              <p className="mt-1 text-sm text-muted">
                {stat.label}
              </p>
            </div>
          );
        })}

      </section>

      {/* Minhas coleções */}

      <section id="colecoes">

        <div className="mb-5 flex items-center
          justify-between">

          <div>
            <h2 className="text-xl font-bold">
              Minhas coleções
            </h2>

            <p className="mt-1 text-sm text-muted">
              Seus mangás adicionados recentemente.
            </p>
          </div>

          <span className="text-sm font-medium text-primary">
            {totalCollections} coleções
          </span>

        </div>

        {mangas.length > 0 ? (

          <div className="grid grid-cols-1 gap-5
            md:grid-cols-2 xl:grid-cols-3">

            {mangas.map((manga) => (
              <MangaCard
                key={manga.id}
                {...manga}
              />
            ))}

          </div>

        ) : (

          <div className="rounded-xl border border-dashed
            border-border bg-card/50 p-10 text-center">

            <BookOpen
              size={36}
              className="mx-auto mb-4 text-primary"
            />

            <h2 className="text-lg font-bold">
              Sua mangateca está vazia!
            </h2>

            <p className="mt-2 text-sm text-muted">
              Comece adicionando seu primeiro mangá.
            </p>

            <button
              type="button"
              onClick={() => setIsFormOpen(true)}
              className="mt-5 inline-flex items-center gap-2
                rounded-lg bg-primary px-5 py-3
                font-semibold text-white transition
                hover:opacity-90"
            >
              <Plus size={19} />
              Adicionar primeiro mangá
            </button>

          </div>

        )}

      </section>

      {/* Modal de cadastro */}

      {isFormOpen && (
        <MangaForm
          onClose={() => setIsFormOpen(false)}
        />
      )}

    </main>
  );
}

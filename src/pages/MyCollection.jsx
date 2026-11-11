import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Search,
  Library,
  BookOpen,
  Building2,
  ArrowUpDown,
  FilterX,
  Plus,
  FileDown,
} from "lucide-react";

import { MangaCard } from "../components/MangaCard";
import { useMangas } from "../context/MangaContext";
import { MangaForm } from "../components/MangaForm";
import { generateMissingVolumesPDF } from "../utils/generateMissingVolumesPDF";

export function MyCollection() {
  const { mangas, deleteManga } = useMangas();

  // Estados dos filtros
  const [search, setSearch] = useState("");
  const [publisherFilter, setPublisherFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("az");
  const [selectedManga, setSelectedManga] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const navigate = useNavigate();

  // Lista de editoras cadastradas
  const publishers = [
    ...new Set(mangas.map((manga) => manga.publisher)),
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  // Estatísticas gerais
  const totalCollections = mangas.length;

  const totalOwned = mangas.reduce(
    (sum, manga) => sum + manga.ownedVolumes.length,
    0
  );

  const totalPublishers = publishers.length;

  // Pesquisa, filtros e ordenação
  const filteredMangas = useMemo(() => {
    let result = [...mangas];

    // Pesquisa pelo título
    if (search.trim()) {
      result = result.filter((manga) =>
        manga.title
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      );
    }

    // Filtro por editora
    if (publisherFilter !== "all") {
      result = result.filter(
        (manga) => manga.publisher === publisherFilter
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      result = result.filter(
        (manga) => manga.publicationStatus === statusFilter
      );
    }

    // Ordenação alfabética
    result.sort((a, b) => {
      const comparison = a.title.localeCompare(
        b.title,
        "pt-BR",
        { sensitivity: "base" }
      );

      return sortOrder === "az" ? comparison : -comparison;
    });

    return result;
  }, [mangas, search, publisherFilter, statusFilter, sortOrder]);

  function handleAdd() {
  setSelectedManga(null);
  setIsFormOpen(true);
}

function handleEdit(manga) {
  setSelectedManga(manga);
  setIsFormOpen(true);
}

function handleCloseForm() {
  setIsFormOpen(false);
  setSelectedManga(null);
}

function handleDelete(manga) {
  const confirmed = window.confirm(
    `Tem certeza de que deseja excluir "${manga.title}"? Essa ação não poderá ser desfeita.`
  );

  if (confirmed) {
    deleteManga(manga.id);
  }
}

function handleGeneratePDF() {
  const generated = generateMissingVolumesPDF(mangas);

  if (!generated) {
    window.alert("Parabéns! Você não tem volumes faltantes na sua coleção.");
  }
}

  // Limpar filtros
  function clearFilters() {
    setSearch("");
    setPublisherFilter("all");
    setStatusFilter("all");
    setSortOrder("az");
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    publisherFilter !== "all" ||
    statusFilter !== "all" ||
    sortOrder !== "az";

  return (
    <main className="flex-1 px-6 py-8 lg:px-10">

      {/* Cabeçalho */}

      <section className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Minha Coleção
        </h1>

        <p className="mt-2 text-sm text-muted">
          Gerencie, pesquise e organize todos os seus mangás.
        </p>
      </section>

      {/* Estatísticas */}

      <section className="mb-8 grid grid-cols-1 gap-4
        sm:grid-cols-3">

        <div className="rounded-xl border border-border
          bg-card p-5">

          <div className="mb-4 rounded-lg bg-primary/15
            p-3 text-primary w-fit">
            <Library size={22} />
          </div>

          <p className="text-3xl font-bold">
            {totalCollections}
          </p>

          <p className="mt-1 text-sm text-muted">
            Obras cadastradas
          </p>
        </div>

        <div className="rounded-xl border border-border
          bg-card p-5">

          <div className="mb-4 rounded-lg bg-primary/15
            p-3 text-primary w-fit">
            <BookOpen size={22} />
          </div>

          <p className="text-3xl font-bold">
            {totalOwned}
          </p>

          <p className="mt-1 text-sm text-muted">
            Volumes adquiridos
          </p>
        </div>

        <div className="rounded-xl border border-border
          bg-card p-5">

          <div className="mb-4 rounded-lg bg-primary/15
            p-3 text-primary w-fit">
            <Building2 size={22} />
          </div>

          <p className="text-3xl font-bold">
            {totalPublishers}
          </p>

          <p className="mt-1 text-sm text-muted">
            Editoras diferentes
          </p>
        </div>

      </section>

      {/* Pesquisa e filtros */}

      <section className="mb-8 rounded-xl border
        border-border bg-card p-5">

        <div className="mb-4 flex items-center gap-2">
          <Search size={20} className="text-primary" />

          <h2 className="font-semibold">
            Pesquisar e filtrar
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4
          md:grid-cols-2 xl:grid-cols-4">

          {/* Pesquisa */}

          <div className="xl:col-span-2">
            <label className="mb-2 block text-sm font-medium">
              Nome do mangá
            </label>

            <div className="flex items-center gap-2 rounded-lg
              border border-border bg-background px-3 py-2.5
              focus-within:border-primary">

              <Search size={18} className="text-muted" />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Digite o título..."
                className="w-full bg-transparent text-sm
                  text-foreground outline-none
                  placeholder:text-muted"
              />
            </div>
          </div>

          {/* Editora */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Editora
            </label>

            <select
              value={publisherFilter}
              onChange={(e) => setPublisherFilter(e.target.value)}
              className="w-full rounded-lg border border-border
                bg-background px-3 py-2.5 text-sm
                text-foreground outline-none
                focus:border-primary"
            >
              <option value="all">Todas as editoras</option>

              {publishers.map((publisher) => (
                <option key={publisher} value={publisher}>
                  {publisher}
                </option>
              ))}
            </select>
          </div>

          {/* Status */}

          <div>
            <label className="mb-2 block text-sm font-medium">
              Status da publicação
            </label>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-lg border border-border
                bg-background px-3 py-2.5 text-sm
                text-foreground outline-none
                focus:border-primary"
            >
              <option value="all">Todos os status</option>
              <option value="ongoing">Em publicação</option>
              <option value="completed">Concluído</option>
            </select>
          </div>

        </div>

        {/* Ordenação e limpeza */}

        <div className="mt-5 flex flex-col gap-3
          border-t border-border pt-4 sm:flex-row
          sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">
            <ArrowUpDown size={17} className="text-muted" />

            <label htmlFor="sort-order" className="text-sm">
              Ordenar:
            </label>

            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="rounded-lg border border-border
                bg-background px-3 py-2 text-sm
                text-foreground outline-none
                focus:border-primary"
            >
              <option value="az">A - Z</option>
              <option value="za">Z - A</option>
            </select>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-2
                text-sm font-medium text-primary
                transition hover:opacity-75"
            >
              <FilterX size={17} />
              Limpar filtros
            </button>
          )}

        </div>

      </section>

      {/* Resultados */}

      <section>

        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">
              Todos os mangás
            </h2>

            <p className="mt-1 text-sm text-muted">
              Suas coleções cadastradas.
            </p>
          </div>

          <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">


            <span className="whitespace-nowrap text-sm font-medium text-primary">
                {filteredMangas.length} resultados
            </span>

              <button
                type="button"
                onClick={handleGeneratePDF}
                className="inline-flex w-full justify-center items-center gap-2 rounded-lg border border-border bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground transition hover:border-primary hover:text-primary"
              >
                <FileDown size={18} />
                Gerar PDF
              </button>
            <button
                type="button"
                onClick={handleAdd}
                className="inline-flex w-full justify-center items-center gap-2 sm:w-auto rounded-lg
                bg-primary px-4 py-2.5 text-sm font-semibold
                text-white transition hover:opacity-90"
            >
                <Plus size={18} />
                Adicionar
            </button>

</div>
        </div>

        {filteredMangas.length > 0 ? (

          <div className="grid grid-cols-1 gap-5
            md:grid-cols-2 xl:grid-cols-3">

            {filteredMangas.map((manga) => (
              <div key={manga.id} className="min-w-0">

                <MangaCard
                    {...manga}
                    onView={() => navigate(`/colecao/${manga.id}`)}
                    onEdit={() => handleEdit(manga)}
                    onDelete={() => handleDelete(manga)}
                    />

                <div className="mt-2 flex items-center
                  justify-between gap-2 px-1">

                  <span className="text-xs text-muted">
                    {manga.format}
                  </span>

                  <span className={`rounded-full px-2.5 py-1
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

              </div>
            ))}

          </div>

        ) : (

          <div className="rounded-xl border border-dashed
            border-border bg-card/50 p-12 text-center">

            <Search
              size={36}
              className="mx-auto mb-4 text-muted"
            />

            <h3 className="text-lg font-bold">
              Nenhum mangá encontrado
            </h3>

            <p className="mt-2 text-sm text-muted">
              Tente alterar os termos da pesquisa ou os filtros.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-lg bg-primary
                px-5 py-2.5 text-sm font-semibold
                text-white transition hover:opacity-90"
            >
              Limpar filtros
            </button>

          </div>

        )}

      </section>

      {isFormOpen && (
        <MangaForm
            manga={selectedManga}
            onClose={handleCloseForm}
        />
        )}

    </main>
  );
}

import { useMemo, useState } from "react";

import {
  Plus,
  Heart,
  Search,
  Pencil,
  Trash2,
  BookOpen,
  ArrowRight,
  X,
} from "lucide-react";

import { useMangas } from "../context/MangaContext";

import { MangaForm } from "../components/MangaForm";
import { StatRow } from "../components/StatRow";
import { WishlistForm } from "../components/WishlistForm";

export function Wishlist() {
  const {
    wishlist,
    deleteWishlistItem,
    moveWishlistToCollection,
  } = useMangas();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [transferItem, setTransferItem] = useState(null);

  const [search, setSearch] = useState("");
  const [selectedPublisher, setSelectedPublisher] = useState("Todas");

  // Editoras disponíveis nos desejos cadastrados
  const publishers = useMemo(() => {
    return [
      "Todas",
      ...new Set(wishlist.map((item) => item.publisher)),
    ];
  }, [wishlist]);

  // Pesquisa e filtro
  const filteredWishlist = useMemo(() => {
    return wishlist.filter((item) => {
      const matchesSearch = item.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesPublisher =
        selectedPublisher === "Todas" ||
        item.publisher === selectedPublisher;

      return matchesSearch && matchesPublisher;
    });
  }, [wishlist, search, selectedPublisher]);

  function handleAdd() {
    setEditingItem(null);
    setIsFormOpen(true);
  }

  function handleEdit(item) {
    setEditingItem(item);
    setIsFormOpen(true);
  }

  function handleCloseForm() {
    setIsFormOpen(false);
    setEditingItem(null);
  }

  function handleTransfer(item) {
    setEditingItem(null);
    setTransferItem(item);
    setIsFormOpen(false);
  }

  function handleCloseTransfer() {
    setTransferItem(null);
}

  function handleDelete(item) {
    const confirmed = window.confirm(
      `Deseja realmente remover "${item.title}" da sua lista de desejos?`
    );

    if (confirmed) {
      deleteWishlistItem(item.id);
    }
  }

  return (
    <main className="flex-1 px-6 py-8 lg:px-10">

      {/* Cabeçalho */}

      <section className="mb-8 flex flex-col gap-4
        sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="display text-3xl sm:text-4xl">
            Minha Lista de Desejos
          </h1>

          <p className="mt-2 text-sm text-muted">
            Organize os mangás que pretende adquirir.
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="inline-flex items-center justify-center
            gap-2 rounded-lg bg-primary px-5 py-3
            font-semibold text-white transition
            hover:opacity-90"
        >
          <Plus size={20} />
          Adicionar desejo
        </button>

      </section>

      {/* Indicadores */}

      <StatRow
        className="mb-10"
        items={[
          { label: "Mangás desejados", value: wishlist.length },
          {
            label: "Editoras diferentes",
            value: new Set(wishlist.map((item) => item.publisher)).size,
          },
        ]}
      />

      {/* Pesquisa e filtros */}

      <section className="mb-6 flex flex-col gap-3 sm:flex-row">

        <div className="flex flex-1 items-center gap-2
          rounded-lg border border-border bg-card px-3 py-3">

          <Search size={19} className="shrink-0 text-muted" />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar mangá..."
            className="w-full bg-transparent text-sm
              text-foreground outline-none
              placeholder:text-muted"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Limpar pesquisa"
              className="text-muted hover:text-foreground"
            >
              <X size={18} />
            </button>
          )}

        </div>

        <select
          value={selectedPublisher}
          onChange={(event) =>
            setSelectedPublisher(event.target.value)
          }
          className="rounded-lg border border-border
            bg-card px-3 py-3 text-sm text-foreground
            outline-none focus:border-primary"
        >
          {publishers.map((publisher) => (
            <option key={publisher} value={publisher}>
              {publisher === "Todas"
                ? "Todas as editoras"
                : publisher}
            </option>
          ))}
        </select>

      </section>

      {/* Lista de desejos */}

      <section>

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="display text-2xl">
              Mangás desejados
            </h2>

            <p className="mt-1 text-sm text-muted">
              Obras que você pretende adquirir.
            </p>
          </div>

          <span className="text-sm font-medium text-primary">
            {filteredWishlist.length}{" "}
            {filteredWishlist.length === 1 ? "resultado" : "resultados"}
          </span>
        </div>

        {filteredWishlist.length > 0 ? (

          <div className="grid grid-cols-1 gap-5
            md:grid-cols-2 xl:grid-cols-3">

            {filteredWishlist.map((item) => (

              <article
                key={item.id}
                className="rounded-xl border border-border
                  bg-card p-5 transition
                  hover:border-primary/60"
              >

                {/* Informações */}

                <div className="flex items-start gap-4">

                  <div className="flex h-24 w-20 shrink-0
                    items-center justify-center rounded-lg
                    bg-primary/10 text-primary">

                    <BookOpen size={32} />

                  </div>

                  <div className="min-w-0 flex-1">

                    <h3 className="display break-words text-2xl leading-tight">
                      {item.title}
                    </h3>

                    <p className="mt-1 text-sm text-muted">
                      {item.publisher}
                    </p>

                    <span className="mt-3 inline-flex rounded-full
                      bg-secondary px-3 py-1 text-xs
                      text-muted">
                      {item.format}
                    </span>

                  </div>

                  <Heart
                    size={20}
                    className="shrink-0 fill-primary/15 text-primary"
                  />

                </div>

                {/* Ações */}

                <div className="mt-5 flex flex-wrap items-center
                    justify-between gap-3 border-t border-border pt-4">

                    <span className="text-xs text-muted">
                        Na lista de desejos
                    </span>

                    <div className="flex items-center gap-2">

                        <button
                        type="button"
                        onClick={() => handleTransfer(item)}
                        title="Adicionar à Minha Coleção"
                        className="inline-flex items-center gap-2
                            rounded-lg bg-primary px-3 py-2
                            text-xs font-semibold text-white
                            transition hover:opacity-90"
                        >
                        <ArrowRight size={16} />
                        Adquirido
                        </button>

                        <button
                        type="button"
                        onClick={() => handleEdit(item)}
                        title="Editar desejo"
                        aria-label={`Editar ${item.title}`}
                        className="rounded-lg border border-border
                            p-2 text-muted transition
                            hover:border-primary hover:text-primary"
                        >
                        <Pencil size={17} />
                        </button>

                        <button
                        type="button"
                        onClick={() => handleDelete(item)}
                        title="Excluir desejo"
                        aria-label={`Excluir ${item.title}`}
                        className="rounded-lg border border-border
                            p-2 text-muted transition
                            hover:border-red-500 hover:text-red-500"
                        >
                        <Trash2 size={17} />
                        </button>

                    </div>
                    </div>

              </article>

            ))}

          </div>

        ) : (

          <div className="rounded-xl border border-dashed
            border-border bg-card/50 p-10 text-center">

            <Heart
              size={36}
              className="mx-auto mb-4 text-primary"
            />

            <h2 className="display text-2xl">
              {wishlist.length === 0
                ? "Sua lista de desejos está vazia!"
                : "Nenhum mangá encontrado."}
            </h2>

            <p className="mt-2 text-sm text-muted">
              {wishlist.length === 0
                ? "Adicione os mangás que você gostaria de adquirir."
                : "Tente alterar a pesquisa ou o filtro selecionado."}
            </p>

            {wishlist.length === 0 && (
              <button
                type="button"
                onClick={handleAdd}
                className="mt-5 inline-flex items-center
                  gap-2 rounded-lg bg-primary px-5 py-3
                  font-semibold text-white transition
                  hover:opacity-90"
              >
                <Plus size={19} />
                Adicionar primeiro desejo
              </button>
            )}

          </div>

        )}

      </section>

      {/* Formulário */}

      {isFormOpen && (
        <WishlistForm
            wishlistItem={editingItem}
            onClose={handleCloseForm}
        />
            )}

            {transferItem && (
            <MangaForm
                initialData={transferItem}
                onClose={handleCloseTransfer}
                onAdd={(mangaData) => {
                moveWishlistToCollection(
                    transferItem.id,
                    mangaData
                );
                }}
            />
            )}

    </main>
  );
}

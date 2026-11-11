
import { useState } from "react";

import { X, Heart } from "lucide-react";

import { useMangas } from "../context/MangaContext";

const publishers = [
  "Panini",
  "JBC",
  "NewPOP",
  "Pipoca & Nanquim",
  "Nova Sampa",
];

const formats = [
  "Tankōbon",
  "2 em 1",
  "3 em 1",
  "Big",
  "Omnibus",
  "Wideban",
  "Kanzenban",
  "Especial",
  "Outro",
];

export function WishlistForm({ onClose, wishlistItem = null }) {
  const { addWishlistItem, updateWishlistItem } = useMangas();

  const isEditing = Boolean(wishlistItem);

  const [title, setTitle] = useState(
    wishlistItem?.title || ""
  );

  const [publisher, setPublisher] = useState(
    wishlistItem?.publisher &&
      publishers.includes(wishlistItem.publisher)
      ? wishlistItem.publisher
      : wishlistItem?.publisher
        ? "Outra"
        : ""
  );

  const [otherPublisher, setOtherPublisher] = useState(
    wishlistItem?.publisher &&
      !publishers.includes(wishlistItem.publisher)
      ? wishlistItem.publisher
      : ""
  );

  const [format, setFormat] = useState(
    wishlistItem?.format || "Tankōbon"
  );

  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const finalPublisher =
      publisher === "Outra"
        ? otherPublisher.trim()
        : publisher;

    if (!title.trim()) {
      setError("Informe o nome do mangá.");
      return;
    }

    if (!finalPublisher) {
      setError("Selecione ou informe uma editora.");
      return;
    }

    const wishlistData = {
      title: title.trim(),
      publisher: finalPublisher,
      format,
    };

    if (isEditing) {
      updateWishlistItem(wishlistItem.id, wishlistData);
    } else {
      addWishlistItem(wishlistData);
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center
      justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg
        overflow-y-auto rounded-xl border border-border
        bg-card p-6 shadow-2xl">

        {/* Cabeçalho */}

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">

            <div className="rounded-lg bg-primary/10
              p-2 text-primary">
              <Heart size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {isEditing
                  ? "Editar desejo"
                  : "Adicionar à lista de desejos"}
              </h2>

              <p className="text-sm text-muted">
                {isEditing
                  ? "Atualize as informações do mangá."
                  : "Cadastre uma obra que deseja adquirir."}
              </p>
            </div>

          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário"
            className="rounded-lg p-2 text-muted
              transition hover:bg-secondary
              hover:text-foreground"
          >
            <X size={20} />
          </button>

        </div>

        {/* Formulário */}

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Título */}

          <div>
            <label className="mb-1 block text-sm font-medium">
              Nome do mangá
            </label>

            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Ex.: Berserk"
              required
              autoFocus
              className="w-full rounded-lg border border-border
                bg-background px-3 py-2.5 text-sm
                text-foreground outline-none
                focus:border-primary"
            />
          </div>

          {/* Editora e formato */}

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Editora
              </label>

              <select
                value={publisher}
                onChange={(event) => setPublisher(event.target.value)}
                required
                className="w-full rounded-lg border border-border
                  bg-background px-3 py-2.5 text-sm
                  text-foreground outline-none
                  focus:border-primary"
              >
                <option value="">Selecione</option>

                {publishers.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}

                <option value="Outra">Outra</option>
              </select>

              {publisher === "Outra" && (
                <input
                  type="text"
                  value={otherPublisher}
                  onChange={(event) =>
                    setOtherPublisher(event.target.value)
                  }
                  placeholder="Nome da editora"
                  required
                  className="mt-2 w-full rounded-lg
                    border border-border bg-background
                    px-3 py-2.5 text-sm text-foreground
                    outline-none focus:border-primary"
                />
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Formato
              </label>

              <select
                value={format}
                onChange={(event) => setFormat(event.target.value)}
                className="w-full rounded-lg border border-border
                  bg-background px-3 py-2.5 text-sm
                  text-foreground outline-none
                  focus:border-primary"
              >
                {formats.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Mensagem de erro */}

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3
              text-sm text-red-500">
              {error}
            </p>
          )}

          {/* Ações */}

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border
                px-4 py-2.5 text-sm transition
                hover:bg-secondary"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2.5
                text-sm font-semibold text-white
                transition hover:opacity-90"
            >
              {isEditing ? "Salvar alterações" : "Adicionar desejo"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}
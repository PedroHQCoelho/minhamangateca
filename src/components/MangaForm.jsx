import { useEffect, useState } from "react";
import { X, BookOpen, ImagePlus, Trash2 } from "lucide-react";
import { useMangas } from "../context/MangaContext";
import {
  saveCover,
  getCover,
  deleteCover,
} from "../utils/imageStorage";

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

export function MangaForm({ 
  onClose, 
  manga = null, 
  initialData = null,
  onAdd = null,
}) {
  const { addManga, updateManga } = useMangas();

  const isEditing = Boolean(manga);
  const formData = manga || initialData;
  const isCustomFormat =
    formData?.format && !formats.includes(formData.format);

  const [title, setTitle] = useState(formData?.title || "");

  const [publisher, setPublisher] = useState(
    formData?.publisher && publishers.includes(formData.publisher)
      ? formData.publisher
      : formData?.publisher
        ? "Outra"
        : ""
  );

  const [otherPublisher, setOtherPublisher] = useState(
    formData?.publisher && !publishers.includes(formData.publisher)
      ? formData.publisher
      : ""
  );

  const [format, setFormat] = useState(
    isCustomFormat ? "Outro" : formData?.format || "Tankōbon"
  );

  const [otherFormat, setOtherFormat] = useState(
    isCustomFormat ? formData.format : ""
  );

  const [totalVolumes, setTotalVolumes] = useState(
    formData ? String(formData.totalVolumes ?? "") : ""
  );

  const [ownedVolumes, setOwnedVolumes] = useState(
    formData?.ownedVolumes?.join(", ") || ""
  );

  const [publicationStatus, setPublicationStatus] = useState(
    formData?.publicationStatus || "ongoing"
  );

  const [error, setError] = useState("");
  const [coverFile, setCoverFile] = useState(null);
  const [coverPreview, setCoverPreview] = useState("");
  const [savedCoverPreview, setSavedCoverPreview] = useState("");
  const [removeCover, setRemoveCover] = useState(false);
  const [coverError, setCoverError] = useState("");

  // Carregar a capa já cadastrada
useEffect(() => {
  let imageUrl = "";

  async function loadCover() {
    if (!manga?.id) return;

    try {
      const image = await getCover(manga.id);

      if (image) {
        imageUrl = URL.createObjectURL(image);
        setSavedCoverPreview(imageUrl);
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

// Criar pré-visualização da nova imagem
useEffect(() => {
  if (!coverFile) {
    setCoverPreview("");
    return;
  }

  const imageUrl = URL.createObjectURL(coverFile);
  setCoverPreview(imageUrl);

  return () => URL.revokeObjectURL(imageUrl);
}, [coverFile]);

  function handleCoverChange(event) {
  const file = event.target.files[0];

  setCoverError("");

  if (!file) return;

  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  if (!allowedTypes.includes(file.type)) {
    setCoverError("Escolha uma imagem JPG, PNG ou WebP.");
    event.target.value = "";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    setCoverError("A imagem deve ter no máximo 5 MB.");
    event.target.value = "";
    return;
  }

  setCoverFile(file);
  setRemoveCover(false);
}

  function parseVolumes(value) {
    if (!value.trim()) return [];

    const volumes = [];

    const parts = value.split(",");

    for (const part of parts) {
      const item = part.trim();

      if (!item) {
        throw new Error("Confira os volumes informados.");
      }

      if (item.includes("-")) {
        const range = item.split("-");

        if (range.length !== 2) {
          throw new Error("Confira os intervalos informados.");
        }

        const [startText, endText] = range;

        const start = Number(startText);
        const end = Number(endText);

        if (
          !Number.isInteger(start) ||
          !Number.isInteger(end) ||
          start < 1 ||
          end < start
        ) {
          throw new Error("Confira os intervalos informados.");
        }

        for (let i = start; i <= end; i++) {
          volumes.push(i);
        }
      } else {
        const volume = Number(item);

        if (!Number.isInteger(volume) || volume < 1) {
          throw new Error("Informe números de volumes válidos.");
        }

        volumes.push(volume);
      }
    }

    return [...new Set(volumes)].sort((a, b) => a - b);
  }

  async function handleSubmit(event) {
  event.preventDefault();
  setError("");

  try {
    const total = Number(totalVolumes);
    const owned = parseVolumes(ownedVolumes);

    const finalPublisher =
      publisher === "Outra"
        ? otherPublisher.trim()
        : publisher;

    if (!title.trim()) {
      throw new Error("Informe o nome do mangá.");
    }

    if (!finalPublisher) {
      throw new Error("Selecione ou informe uma editora.");
    }

    if (!Number.isInteger(total) || total < 1) {
      throw new Error("Informe um total de volumes válido.");
    }

    if (owned.some((volume) => volume > total)) {
      throw new Error(
        "Um dos volumes informados ultrapassa o total da coleção."
      );
    }

    const finalFormat =
      format === "Outro"
        ? otherFormat.trim()
        : format;

    if (!finalFormat) {
      throw new Error("Informe o formato da edição.");
    }

    const mangaId = isEditing
      ? manga.id
      : crypto.randomUUID();

    const mangaData = {
      id: mangaId,
      title: title.trim(),
      publisher: finalPublisher,
      format: finalFormat,
      publicationStatus,
      totalVolumes: total,
      ownedVolumes: owned,
      coverColor: formData?.coverColor || "#604276",
      coverLabel: formData?.coverLabel || title.trim().toUpperCase(),
      coverUpdatedAt:
        coverFile || removeCover
          ? Date.now()
          : formData?.coverUpdatedAt || 0,
    };

    // Salvar ou remover a imagem
    if (coverFile) {
      await saveCover(mangaId, coverFile);
    } else if (removeCover && isEditing) {
      await deleteCover(mangaId);
    }

    // Salvar os dados do mangá
    if (isEditing) {
      updateManga(manga.id, mangaData);
    } else if (onAdd) {
      onAdd(mangaData);
    } else {
      addManga(mangaData);
    }

    onClose();
  } catch (err) {
    setError(err.message || "Não foi possível salvar o mangá.");
  }
}

  return (
    <div className="fixed inset-0 z-50 flex items-center
      justify-center bg-black/60 p-4 backdrop-blur-sm">

      <div className="max-h-[90vh] w-full max-w-lg
        overflow-y-auto rounded-xl border border-border
        bg-card p-6 shadow-2xl">

        <div className="mb-6 flex items-center justify-between">

          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2
              text-primary">
              <BookOpen size={22} />
            </div>

            <div>
              <h2 className="text-xl font-bold">
                {isEditing ? "Editar mangá" : "Adicionar mangá"}
              </h2>

              <p className="text-sm text-muted">
                {isEditing
                  ? "Atualize as informações da coleção."
                  : "Cadastre uma nova coleção."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar formulário"
            className="rounded-lg p-2 text-muted
              transition hover:bg-secondary hover:text-foreground"
          >
            <X size={20} />
          </button>

        </div>

        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label className="mb-1 block text-sm font-medium">
              Nome do mangá
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Fullmetal Alchemist"
              required
              className="w-full rounded-lg border border-border
                bg-background px-3 py-2.5 text-sm
                text-foreground outline-none
                focus:border-primary"
            />
          </div>

          <div>
  <label className="mb-2 block text-sm font-medium">
    Capa do mangá
  </label>

  <div className="flex flex-col gap-3 sm:flex-row sm:items-start">

    <div className="flex h-40 w-28 shrink-0 items-center
      justify-center overflow-hidden rounded-lg border
      border-border bg-secondary">

      {coverPreview || (!removeCover && savedCoverPreview) ? (
        <img
          src={coverPreview || savedCoverPreview}
          alt={`Capa de ${title || "mangá"}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-2
          text-muted">
          <BookOpen size={30} />
          <span className="text-xs">Sem capa</span>
        </div>
      )}

    </div>

    <div className="flex flex-col items-start gap-2">

      <label className="flex cursor-pointer items-center gap-2
        rounded-lg border border-border px-3 py-2.5
        text-sm transition hover:bg-secondary">

        <ImagePlus size={17} />

        {coverPreview || savedCoverPreview
          ? "Escolher outra imagem"
          : "Selecionar imagem"}

        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleCoverChange}
          className="hidden"
        />
      </label>

      {(coverFile || savedCoverPreview) && !removeCover && (
        <button
          type="button"
          onClick={() => {
            setCoverFile(null);
            setRemoveCover(true);
            setCoverError("");
          }}
          className="flex items-center gap-2 rounded-lg
            px-3 py-2 text-sm text-red-500
            transition hover:bg-red-500/10"
        >
          <Trash2 size={16} />
          Remover capa
        </button>
      )}

      <p className="text-xs text-muted">
        JPG, PNG ou WebP. Máximo de 5 MB.
      </p>

    </div>
  </div>

  {coverError && (
    <p className="mt-2 text-sm text-red-500">
      {coverError}
    </p>
  )}
</div>

          <div className="grid grid-cols-2 gap-3">

            <div>
              <label className="mb-1 block text-sm font-medium">
                Editora
              </label>

              <select
                value={publisher}
                onChange={(e) => setPublisher(e.target.value)}
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
                  onChange={(e) => setOtherPublisher(e.target.value)}
                  placeholder="Nome da editora"
                  required
                  className="mt-2 w-full rounded-lg border
                    border-border bg-background px-3 py-2.5
                    text-sm text-foreground outline-none
                    focus:border-primary"
                />
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Formato
              </label>

              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
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

              {format === "Outro" && (
                  <input
                    type="text"
                    value={otherFormat}
                    onChange={(e) => setOtherFormat(e.target.value)}
                    placeholder="Informe o formato"
                    required
                    className="mt-2 w-full rounded-lg border
                      border-border bg-background px-3 py-2.5
                      text-sm text-foreground outline-none
                      focus:border-primary"
                  />
                )}
            </div>

          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Volumes publicados no Brasil
            </label>

            <input
              type="number"
              min="1"
              value={totalVolumes}
              onChange={(e) => setTotalVolumes(e.target.value)}
              placeholder="Ex.: 27"
              required
              className="w-full rounded-lg border border-border
                bg-background px-3 py-2.5 text-sm
                text-foreground outline-none
                focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Status da publicação
            </label>

            <select
              value={publicationStatus}
              onChange={(e) => setPublicationStatus(e.target.value)}
              className="w-full rounded-lg border border-border
                bg-background px-3 py-2.5 text-sm
                text-foreground outline-none
                focus:border-primary"
            >
              <option value="ongoing">Em publicação</option>
              <option value="completed">Concluído</option>
            </select>

            <p className="mt-1 text-xs text-muted">
              Considere a situação da edição brasileira.
            </p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Volumes que você possui
            </label>

            <input
              type="text"
              value={ownedVolumes}
              onChange={(e) => setOwnedVolumes(e.target.value)}
              placeholder="Ex.: 1-23, 27"
              className="w-full rounded-lg border border-border
                bg-background px-3 py-2.5 text-sm
                text-foreground outline-none
                focus:border-primary"
            />

            <p className="mt-1 text-xs text-muted">
              Separe os números por vírgulas ou use intervalos.
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-500/10 p-3
              text-sm text-red-500">
              {error}
            </p>
          )}

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
              {isEditing ? "Salvar alterações" : "Adicionar mangá"}
            </button>

          </div>

        </form>
      </div>
    </div>
  );
}

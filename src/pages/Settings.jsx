import { useRef, useState } from "react";
import {
  Download,
  Upload,
  Database,
  Info,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import { useMangas } from "../context/MangaContext";
import {
  getAllCovers,
  replaceAllCovers,
} from "../utils/imageStorage";

// Converte uma imagem em Base64 para armazenar no JSON
function imageToBase64(image) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result;
      resolve(result.split(",")[1]);
    };

    reader.onerror = () => {
      reject(new Error("Não foi possível converter uma imagem."));
    };

    reader.readAsDataURL(image);
  });
}

// Converte Base64 novamente em uma imagem
function base64ToImage(base64, type) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type });
}

export function Settings() {
  const { mangas, wishlist, restoreBackup } = useMangas();

  const fileInputRef = useRef(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  // Exportar backup
  async function handleExport() {
  try {
    setMessage("");
    setMessageType("");

    const storedCovers = await getAllCovers();

    const covers = await Promise.all(
      storedCovers.map(async (cover) => ({
        id: cover.id,
        type: cover.image.type,
        data: await imageToBase64(cover.image),
      }))
    );

    const backup = {
      app: "Minha Mangateca",
      version: 2,
      exportedAt: new Date().toISOString(),
      mangas,
      wishlist,
      covers,
    };

    const json = JSON.stringify(backup, null, 2);

    const blob = new Blob([json], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `minha-mangateca-backup-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setMessage(
      `Backup exportado com sucesso! ${covers.length} capa(s) incluída(s).`
    );
    setMessageType("success");
  } catch (error) {
    console.error("Erro ao exportar backup:", error);

    setMessage("Não foi possível exportar o backup.");
    setMessageType("error");
  }
}

  // Importar backup
  async function handleImport(event) {
  const file = event.target.files?.[0];

  if (!file) return;

  setMessage("");
  setMessageType("");

  try {
    const content = await file.text();
    const backup = JSON.parse(content);

    // Validar versão e estrutura do backup
    if (
      backup.app !== "Minha Mangateca" ||
      ![1, 2].includes(backup.version) ||
      !Array.isArray(backup.mangas) ||
      !Array.isArray(backup.wishlist) ||
      !backup.mangas.every(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.title === "string" &&
          typeof item.totalVolumes === "number" &&
          Array.isArray(item.ownedVolumes)
      ) ||
      !backup.wishlist.every(
        (item) =>
          item &&
          typeof item === "object" &&
          typeof item.id === "string" &&
          typeof item.title === "string"
      )
    ) {
      throw new Error("Arquivo de backup inválido.");
    }

    // Backups antigos não possuem capas
    const savedCovers = backup.covers ?? [];

    if (
      !Array.isArray(savedCovers) ||
      !savedCovers.every(
        (cover) =>
          cover &&
          typeof cover.id === "string" &&
          typeof cover.data === "string" &&
          ["image/jpeg", "image/png", "image/webp"].includes(
            cover.type
          ) &&
          backup.mangas.some((manga) => manga.id === cover.id)
      )
    ) {
      throw new Error("Arquivo de backup inválido.");
    }

    const confirmed = window.confirm(
      "Atenção! A restauração substituirá sua coleção, lista de desejos e capas atuais pelos dados do backup.\n\nDeseja continuar?"
    );

    if (!confirmed) return;

    // Preparar as imagens antes de substituir os dados
    const covers = savedCovers.map((cover) => ({
      id: cover.id,
      image: base64ToImage(cover.data, cover.type),
    }));

    // Restaurar imagens e dados
    await replaceAllCovers(covers);
    restoreBackup({
      ...backup,
      version: 1,
    });

    setMessage(
      `Backup restaurado com sucesso! ${covers.length} capa(s) recuperada(s).`
    );
    setMessageType("success");
  } catch (error) {
    console.error("Erro ao restaurar backup:", error);

    setMessage(
      error.message === "Arquivo de backup inválido."
        ? error.message
        : "Não foi possível ler ou restaurar o arquivo selecionado."
    );

    setMessageType("error");
  } finally {
    // Permite selecionar o mesmo arquivo novamente
    event.target.value = "";
  }
}

  return (
    <main className="flex-1 px-6 py-8 lg:px-10">

      {/* Cabeçalho */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold sm:text-3xl">
          Configurações
        </h1>

        <p className="mt-2 text-sm text-muted">
          Gerencie seus dados e as preferências da aplicação.
        </p>
      </section>

      {/* Gerenciamento de dados */}
      <section className="mb-8">

        <div className="mb-5 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-2 text-primary">
            <Database size={22} />
          </div>

          <div>
            <h2 className="text-xl font-bold">
              Gerenciamento de dados
            </h2>

            <p className="text-sm text-muted">
              Faça backup ou restaure suas informações.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">

          {/* Exportar */}
          <article className="rounded-xl border border-border bg-card p-5">

            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-green-500/10 p-3 text-green-500">
                <Download size={22} />
              </div>

              <h3 className="text-lg font-semibold">
                Exportar backup
              </h3>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-muted">
              Baixe uma cópia de segurança contendo todos
              os mangás da sua coleção e sua lista de desejos.
            </p>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex w-full items-center
                justify-center gap-2 rounded-lg bg-primary
                px-4 py-3 text-sm font-semibold text-white
                transition hover:opacity-90"
            >
              <Download size={18} />
              Exportar backup
            </button>

          </article>

          {/* Importar */}
          <article className="rounded-xl border border-border bg-card p-5">

            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-blue-500/10 p-3 text-blue-500">
                <Upload size={22} />
              </div>

              <h3 className="text-lg font-semibold">
                Restaurar backup
              </h3>
            </div>

            <p className="mb-5 text-sm leading-relaxed text-muted">
              Selecione um arquivo JSON exportado anteriormente
              para recuperar sua coleção e lista de desejos.
            </p>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleImport}
              className="hidden"
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex w-full items-center
                justify-center gap-2 rounded-lg border
                border-border bg-secondary px-4 py-3
                text-sm font-semibold text-foreground
                transition hover:border-primary hover:text-primary"
            >
              <Upload size={18} />
              Selecionar arquivo
            </button>

          </article>

        </div>
      </section>

      {/* Aviso */}
      <section className="mb-8 rounded-xl border border-yellow-500/30
        bg-yellow-500/5 p-4">

        <div className="flex items-start gap-3">
          <AlertTriangle
            size={21}
            className="mt-0.5 shrink-0 text-yellow-500"
          />

          <div>
            <h3 className="font-semibold">
              Importante sobre seus dados
            </h3>

            <p className="mt-1 text-sm leading-relaxed text-muted">
              Seus dados são armazenados localmente no navegador.
              Recomendamos exportar backups regularmente.
              Ao restaurar um backup, os dados atuais da coleção
              e da lista de desejos serão substituídos.
            </p>
          </div>
        </div>

      </section>

      {/* Mensagens */}
      {message && (
        <div
          role="status"
          className={`mb-8 rounded-lg border p-4 text-sm ${
            messageType === "success"
              ? "border-green-500/30 bg-green-500/10 text-green-500"
              : "border-red-500/30 bg-red-500/10 text-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {/* Sobre */}
      <section className="rounded-xl border border-border bg-card p-5">

        <div className="mb-4 flex items-center gap-3">
          <div className="rounded-lg bg-primary/10 p-3 text-primary">
            <Info size={22} />
          </div>

          <h2 className="text-xl font-bold">
            Sobre a Minha Mangateca
          </h2>
        </div>

        <p className="text-sm leading-relaxed text-muted">
          A Minha Mangateca é uma aplicação para organizar
          coleções de mangás, acompanhar volumes adquiridos
          e controlar títulos que você deseja adicionar
          à sua coleção.
        </p>

        <div className="mt-5 flex items-center gap-2 text-sm text-muted">
          <ShieldCheck size={17} className="text-green-500" />
          Seus dados permanecem no armazenamento local do navegador.
        </div>

        <p className="mt-4 text-xs text-muted">
          Minha Mangateca · Versão 1.0
        </p>

      </section>

    </main>
  );
}
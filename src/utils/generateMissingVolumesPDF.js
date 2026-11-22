import { jsPDF } from "jspdf";

import {
  ARCHIVO_CONDENSED_EXTRABOLD,
  ARCHIVO_MEDIUM,
} from "./archivoPdfFonts";

// Vermelho da marca (o mesmo do favicon e da sidebar)
const BRAND_RED = [229, 57, 53];

// Registra a Archivo (a fonte do site) neste documento
function registerBrandFonts(doc) {
  doc.addFileToVFS(
    "Archivo-CondensedExtraBold.ttf",
    ARCHIVO_CONDENSED_EXTRABOLD
  );
  doc.addFont(
    "Archivo-CondensedExtraBold.ttf",
    "ArchivoCondensed",
    "bold"
  );

  doc.addFileToVFS("Archivo-Medium.ttf", ARCHIVO_MEDIUM);
  doc.addFont("Archivo-Medium.ttf", "Archivo", "normal");
}

// Desenha o logo (o mesmo do favicon): quadrado vermelho arredondado,
// livro aberto branco e marcador de página.
// As medidas seguem o desenho original de 64 x 64.
function drawLogoMark(doc, x, y, size) {
  const s = size / 64;

  // Fundo
  doc.setFillColor(...BRAND_RED);
  doc.roundedRect(x, y, size, size, 14 * s, 14 * s, "F");

  // Páginas do livro
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(4 * s);
  doc.setLineCap("round");
  doc.setLineJoin("round");

  doc.lines(
    [
      [-7, -6, -15, -6, -21.5, -3],
      [0, 27],
      [6.5, -3, 14.5, -3, 21.5, 3],
    ],
    x + 32 * s,
    y + 18.5 * s,
    [s, s],
    "S",
    false
  );

  doc.lines(
    [
      [7, -6, 15, -6, 21.5, -3],
      [0, 27],
      [-6.5, -3, -14.5, -3, -21.5, 3],
    ],
    x + 32 * s,
    y + 18.5 * s,
    [s, s],
    "S",
    false
  );

  // Marcador de página
  doc.setFillColor(255, 255, 255);

  doc.lines(
    [
      [4, 0],
      [0, 27],
      [2, 0.5],
      [0, 7],
      [-4, -3.5],
      [-4, 3.5],
      [0, -7],
      [2, -0.5],
    ],
    x + 30 * s,
    y + 18.5 * s,
    [s, s],
    "F",
    true
  );

  // Devolve o traço ao padrão para o restante do relatório
  // (senão as linhas divisórias herdam a espessura do logo)
  doc.setLineCap("butt");
  doc.setLineJoin("miter");
  doc.setLineWidth(0.3);
}

export function generateMissingVolumesPDF(mangas) {
  // Calcular os volumes faltantes de cada mangá
  const missingMangas = mangas
    .map((manga) => {
      const owned = new Set(manga.ownedVolumes || []);

      const missingVolumes = Array.from(
        { length: manga.totalVolumes },
        (_, index) => index + 1
      ).filter((volume) => !owned.has(volume));

      return {
        title: manga.title,
        publisher: manga.publisher,
        missingVolumes,
      };
    })
    .filter((manga) => manga.missingVolumes.length > 0)
    .sort((a, b) =>
      a.title.localeCompare(b.title, "pt-BR", {
        sensitivity: "base",
      })
    );

  // Não gerar relatório vazio
  if (missingMangas.length === 0) {
    return false;
  }

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 18;

  registerBrandFonts(doc);

  const totalMissing = missingMangas.reduce(
    (sum, manga) => sum + manga.missingVolumes.length,
    0
  );

  const date = new Date().toLocaleDateString("pt-BR");

  let y = 16;

  // Cabeçalho: logo + nome, como na sidebar
  const logoSize = 15;

  drawLogoMark(doc, margin, y, logoSize);

  doc.setFont("Archivo", "normal");
  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Minha", margin + logoSize + 4, y + 5.4);

  doc.setFont("ArchivoCondensed", "bold");
  doc.setFontSize(25);
  doc.setTextColor(30);
  doc.text("Mangateca", margin + logoSize + 4, y + 13.6);

  y += logoSize + 13;

  // Título do relatório
  doc.setFont("ArchivoCondensed", "bold");
  doc.setFontSize(18);
  doc.setTextColor(30);
  doc.text("Relatório de volumes faltantes", margin, y);

  y += 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(110);
  doc.text(`Data: ${date}`, margin, y);

  y += 7;

  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);

  y += 10;

  // Resumo
  doc.setTextColor(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(
    `Total: ${totalMissing} volumes faltantes em ${missingMangas.length} obras`,
    margin,
    y
  );

  y += 12;

  // Lista de mangás
  missingMangas.forEach((manga) => {
    const titleLines = doc.splitTextToSize(
      manga.title,
      pageWidth - margin * 2
    );

    const volumeText = `Volumes: ${manga.missingVolumes.join(", ")}`;

    const volumeLines = doc.splitTextToSize(
      volumeText,
      pageWidth - margin * 2
    );

    const blockHeight =
      titleLines.length * 6 +
      6 +
      volumeLines.length * 5 +
      10;

    // Criar nova página quando necessário
    if (y + blockHeight > pageHeight - 20) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30);

    doc.text(titleLines, margin, y);

    y += titleLines.length * 6;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(100);

    doc.text(`Editora: ${manga.publisher}`, margin, y);

    y += 6;

    doc.setTextColor(30);
    doc.text(volumeLines, margin, y);

    y += volumeLines.length * 5;

    doc.setFont("helvetica", "italic");
    doc.setTextColor(100);

    doc.text(
      `${manga.missingVolumes.length} volumes faltantes`,
      margin,
      y
    );

    y += 8;

    doc.setDrawColor(225);
    doc.line(margin, y, pageWidth - margin, y);

    y += 7;
  });

  // Rodapé: logo pequeno + nome à esquerda, numeração à direita
  const pageCount = doc.internal.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);

    drawLogoMark(doc, margin, pageHeight - 16, 5.5);

    doc.setFont("ArchivoCondensed", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30);
    doc.text("Minha Mangateca", margin + 7.5, pageHeight - 11.6);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130);

    doc.text(
      `Página ${page} de ${pageCount}`,
      pageWidth - margin,
      pageHeight - 11.9,
      { align: "right" }
    );
  }

  doc.save("minha-mangateca-volumes-faltantes.pdf");

  return true;
}

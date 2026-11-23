import { jsPDF } from "jspdf";

import {
  ARCHIVO_CONDENSED_EXTRABOLD,
  ARCHIVO_MEDIUM,
} from "./archivoPdfFonts";

// Vermelho da marca (o mesmo do favicon e da sidebar)
const BRAND_RED = [229, 57, 53];

// 漫画 ("manga") das duas páginas do livro, em curvas (medidas do logo 64 x 64).
// Formato: M = mover, L = linha, C = curva cúbica, Z = fechar.
const KANJI_PATHS = [
  "M25.17 29.94L25.8 29.94L25.8 30.63L25.17 30.63ZM23.03 29.94L23.65 29.94L23.65 30.63L23.03 30.63ZM20.89 29.94L21.51 29.94L21.51 30.63L20.89 30.63ZM19.16 28.73L19.16 31.83L27.63 31.83L27.63 28.73ZM21.87 26.88L24.98 26.88L24.98 27.2L21.87 27.2ZM21.87 25.5L24.98 25.5L24.98 25.82L21.87 25.82ZM19.94 24.37L19.94 28.34L27.01 28.34L27.01 24.37ZM15.31 25.72C16.22 26.25 17.43 27.08 17.97 27.64L19.28 26.07C18.67 25.52 17.42 24.77 16.53 24.3ZM14.57 29.37C15.44 29.92 16.61 30.74 17.14 31.31L18.44 29.74C17.85 29.2 16.64 28.45 15.79 27.97ZM14.88 35.9L16.66 37.25C17.45 35.86 18.24 34.36 18.94 32.9L17.39 31.57C16.58 33.18 15.59 34.87 14.88 35.9ZM24.37 33.79C24.05 34.04 23.68 34.27 23.27 34.48C22.86 34.27 22.49 34.04 22.16 33.79ZM18.98 32.2L18.98 33.79L19.71 33.79C20.14 34.34 20.62 34.82 21.16 35.25C20.28 35.49 19.32 35.64 18.31 35.76C18.64 36.18 19.05 36.99 19.22 37.49C20.65 37.26 21.99 36.93 23.18 36.47C24.29 36.96 25.56 37.3 27.01 37.5C27.28 36.98 27.8 36.15 28.23 35.74C27.21 35.64 26.27 35.49 25.42 35.26C26.31 34.61 27.05 33.8 27.58 32.78L26.27 32.13L25.93 32.2Z",
  "M46.77 26.99L46.77 34.63L38.42 34.63L38.42 26.99L36.33 26.99L36.33 37.5L38.42 37.5L38.42 36.66L46.77 36.66L46.77 37.5L48.85 37.5L48.85 26.99ZM39.08 27.23L39.08 34.03L46.1 34.03L46.1 27.23L43.62 27.23L43.62 26.3L49.33 26.3L49.33 24.3L35.87 24.3L35.87 26.3L41.45 26.3L41.45 27.23ZM40.83 31.42L41.62 31.42L41.62 32.3L40.83 32.3ZM43.46 31.42L44.27 31.42L44.27 32.3L43.46 32.3ZM40.83 28.96L41.62 28.96L41.62 29.81L40.83 29.81ZM43.46 28.96L44.27 28.96L44.27 29.81L43.46 29.81Z",
];

// Desenha um desses caminhos preenchido, na posição e escala do logo
function fillPathData(doc, data, x, y, s) {
  const tokens = data.match(/[MLCZ]|-?\d*\.?\d+/g);
  const ops = [];
  let i = 0;

  const point = () => {
    const px = x + parseFloat(tokens[i++]) * s;
    const py = y + parseFloat(tokens[i++]) * s;
    return [px, py];
  };

  while (i < tokens.length) {
    const command = tokens[i++];

    if (command === "M") ops.push({ op: "m", c: point() });
    else if (command === "L") ops.push({ op: "l", c: point() });
    else if (command === "C") ops.push({ op: "c", c: [...point(), ...point(), ...point()] });
    else ops.push({ op: "h", c: [] });
  }

  doc.path(ops);
  doc.fill();
}

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

// Desenha o logo: quadrado vermelho arredondado, livro aberto branco,
// marcador de página e o 漫画 nas páginas.
// As medidas seguem o desenho original de 64 x 64.
function drawLogoMark(doc, x, y, size, withKanji = true) {
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

  // 漫画 nas páginas (só quando o logo é grande o bastante para ler)
  if (withKanji) {
    doc.setFillColor(255, 255, 255);
    KANJI_PATHS.forEach((data) => fillPathData(doc, data, x, y, s));
  }

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

    drawLogoMark(doc, margin, pageHeight - 16, 5.5, false);

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

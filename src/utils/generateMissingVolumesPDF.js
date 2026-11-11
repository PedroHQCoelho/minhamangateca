import { jsPDF } from "jspdf";

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

  const totalMissing = missingMangas.reduce(
    (sum, manga) => sum + manga.missingVolumes.length,
    0
  );

  const date = new Date().toLocaleDateString("pt-BR");

  let y = 20;

  // Cabeçalho
  // Pequeno ícone de livro aberto
  const iconX = margin;
  const iconY = y - 7;

  doc.setDrawColor(220, 38, 38);
  doc.setLineWidth(0.55);

  // Página esquerda
  doc.line(iconX + 6, iconY + 1, iconX + 3, iconY);
  doc.line(iconX + 3, iconY, iconX, iconY);
  doc.line(iconX, iconY, iconX, iconY + 7);
  doc.line(iconX, iconY + 7, iconX + 3, iconY + 7);
  doc.line(iconX + 3, iconY + 7, iconX + 6, iconY + 8);

  // Página direita
  doc.line(iconX + 6, iconY + 1, iconX + 6, iconY + 8);
  doc.line(iconX + 6, iconY + 1, iconX + 9, iconY);
  doc.line(iconX + 9, iconY, iconX + 12, iconY);
  doc.line(iconX + 12, iconY, iconX + 12, iconY + 7);
  doc.line(iconX + 12, iconY + 7, iconX + 9, iconY + 7);
  doc.line(iconX + 9, iconY + 7, iconX + 6, iconY + 8);

  // Título
  doc.setTextColor(30);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("Minha Mangateca", margin + 16, y);
  y += 9;

  doc.setFontSize(12);
  doc.setFont("helvetica", "normal");
  doc.text("Relatorio de volumes faltantes", margin, y);

  y += 7;

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

  // Rodapé com numeração das páginas
  const pageCount = doc.internal.getNumberOfPages();

  for (let page = 1; page <= pageCount; page++) {
    doc.setPage(page);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(130);

    doc.text(
      `Minha Mangateca - Pagina ${page} de ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: "center" }
    );
  }

  doc.save("minha-mangateca-volumes-faltantes.pdf");

  return true;
}
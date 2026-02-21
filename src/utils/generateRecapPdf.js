const { jsPDF } = window.jspdf;

export function generateRecapPdf(
    recapContainer, options= { download: true }
) {
    const { download } = options;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    let y = 20;

    /* HEADER */
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Mon Assistant Formalités", pageWidth / 2, y, { align: "center" });

    y += 8;

    doc.setFontSize(14);
    doc.text("Récapitulatif de demande de création", pageWidth / 2, y, { align: "center" });

    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    const dossierNumber = "MAF-" + Date.now();
    const today = new Date().toLocaleDateString("fr-FR");

    doc.text(`N° Dossier : ${dossierNumber}`, 20, y);
    doc.text(`Date : ${today}`, pageWidth - 20, y, { align: "right" });

    y += 15;

    /* CONTENT */
    const sections = recapContainer.querySelectorAll<HTMLHeadingElement>("h3");

    sections.forEach((sectionTitle) => {
        if (y > pageHeight - 30) {
            doc.addPage();
            y = 20;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(13);
        doc.text(sectionTitle.textContent?.trim() || "", 20, y);
        y += 4;

        doc.setDrawColor(180);
        doc.line(20, y, pageWidth - 20, y);
        y += 8;

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);

        const sectionDiv = sectionTitle.parentElement;
        if (!sectionDiv) return;

        const rows = sectionDiv.querySelectorAll<HTMLDivElement>(".flex");

        rows.forEach((row) => {
            const spans = row.querySelectorAll<HTMLSpanElement>("span");
            if (spans.length < 2) return;

            const label = spans[0].innerText.trim();
            const value = spans[1].innerText.trim() || "-";

            const labelWidth = 65;
            const valueWidth = pageWidth - 40 - labelWidth;
            const lineHeight = 4.5;

            const splitLabel = doc.splitTextToSize(label, labelWidth - 5);
            const splitValue = doc.splitTextToSize(value, valueWidth);

            const rowHeight = Math.max(splitLabel.length, splitValue.length) * lineHeight;

            if (y + rowHeight > pageHeight - 20) {
                doc.addPage();
                y = 20;
            }

            doc.setFont("helvetica", "bold");
            doc.text(splitLabel, 20, y);

            doc.setFont("helvetica", "normal");
            doc.text(splitValue, 20 + labelWidth, y);

            y += rowHeight + 2;
        });

        y += 6;
    });

    /* FOOTER */
    const totalPages = doc.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);

        doc.setFontSize(9);
        doc.setTextColor(120);

        doc.text(
            "Document généré automatiquement par Mon Assistant Formalités",
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
        );

        doc.text(
            `Page ${i} / ${totalPages}`,
            pageWidth - 20,
            pageHeight - 10,
            { align: "right" }
        );
    }

    // 🔥 IMPORTANT : gestion selon option
    if (download) {
        doc.save(`recap-${dossierNumber}.pdf`);
        return null;
    } else {
        return doc.output("blob");
    }
}

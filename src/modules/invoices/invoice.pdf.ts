import PDFDocument from "pdfkit";

const euros = (cents: number) =>
  (cents / 100).toFixed(2).replace(".", ",") + " €";

export const buildInvoicePdf = (
  invoice: any,
): Promise<Buffer> =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (c) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // En-tête
    doc.fontSize(20).fillColor("#4F46E5").text("Localhost", { align: "left" });
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(`Facture n° ${invoice.number}`, { align: "right" })
      .text(`Date : ${invoice.createdAt.toLocaleDateString("fr-FR")}`, {
        align: "right",
      });

    // Vendeur / client
    doc.moveDown().text(`Vendeur : ${invoice.shop.name}`);
    doc.text(
      `Client : ${invoice.order.client.name} — ${invoice.order.client.email}`,
    );

    // Lignes
    doc.moveDown();
    for (const cp of invoice.order.cart.cartProducts) {
      doc.text(
        `${cp.product.name}  x${cp.quantity}  ${euros(cp.unit_price * cp.quantity)}`,
      );
    }

    // Totaux
    doc
      .moveDown()
      .text(`Total HT : ${euros(invoice.total_ht)}`, { align: "right" })
      .text(`TVA 20% : ${euros(invoice.tva)}`, { align: "right" })
      .fontSize(12)
      .text(`Total TTC : ${euros(invoice.total_ttc)}`, { align: "right" });

    doc.end();
  });

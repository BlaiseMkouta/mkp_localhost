import prisma from "../config/prisma";
import { InvoiceStatus } from "../generated/prisma/enums";
import { buildInvoicePdf } from "../modules/invoices/invoice.pdf";
import { UPLOADS_DIR } from "../config/multer/multer.config";
import path from "node:path";
import fs from "node:fs/promises";
import { PDFTilingPattern } from "pdfkit/js/pattern";
import { sendInvoiceMail } from "../providers/resend/invoice-mail.provider";

const MAX_ATTEMPS = 5;
const BACTH = 20;

export const sendPendingInvoices = async () => {
  const pending = await prisma.invoice.findMany({
    where: { status: InvoiceStatus.PROCESSING },
    take: BACTH,
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });

  // console.log("pendings invoices", pending);

  if (!pending) {
    throw new Error("");
  }

  for (const { id } of pending) {
    try {
      const invoice = await prisma.invoice.findFirstOrThrow({
        where: { id },
        include: {
          shop: true,
          order: {
            include: {
              client: true,
              cart: {
                include: { cartProducts: { include: { product: true } } },
              },
            },
          },
        },
      });

      // console.log("invoice to sent", invoice);

      const pdf = await buildInvoicePdf(invoice);
      const pdfPath = path.join(
        UPLOADS_DIR,
        "invoice_pdf",
        `${invoice.number}.pdf`,
      );
      await fs.mkdir(path.dirname(pdfPath), { recursive: true });
      await fs.writeFile(pdfPath, pdf);

      await sendInvoiceMail(
        invoice.order.client.email,
        {
          clientName: invoice.order.client.name,
          shopName: invoice.shop.name,
          date: invoice.createdAt,
          totalTtc: invoice.total_ttc,
          number: invoice.number,
        },
        pdf,
      );

      await prisma.invoice.update({
        where: { id },
        data: { status: InvoiceStatus.SENT, pdfPath },
      });
    } catch (error) {
      console.error("error");
    }
  }
};

import { APP_NAME, BRAND_COLOR, escapeHtml, MAIL_FROM, resend } from "./resend.client";


type InvoiceMailData = {
  clientName: string;
  shopName: string;
  number: string;
  date: Date;
  totalTtc: number; // en centimes
};

const euros = (cents: number) =>
  (cents / 100).toLocaleString("fr-FR", { style: "currency", currency: "EUR" });

const invoiceMailTemplate = (d: InvoiceMailData) => {
  const safeName = escapeHtml(d.clientName);
  const safeShop = escapeHtml(d.shopName);
  const date = d.date.toLocaleDateString("fr-FR");

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Votre facture ${d.number}</title>
  </head>
  <body style="margin:0;padding:0;background:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">Facture ${d.number} de ${safeShop} : ${euros(d.totalTtc)}</div>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#FFFFFF;border-radius:16px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">
            <tr>
              <td style="background:${BRAND_COLOR};padding:24px;text-align:center;">
                <span style="color:#FFFFFF;font-size:22px;font-weight:700;letter-spacing:0.5px;">${APP_NAME}</span>
              </td>
            </tr>
            <tr>
              <td style="padding:32px 32px 8px;">
                <h1 style="margin:0 0 16px;font-size:20px;color:#111827;">Bonjour ${safeName},</h1>
                <p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4B5563;">
                  Merci pour votre commande chez <strong>${safeShop}</strong>.
                  Vous trouverez votre facture en pièce jointe de cet e-mail.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;border:1px solid #E5E7EB;border-radius:10px;">
                  <tr>
                    <td style="padding:12px 16px;font-size:14px;color:#6B7280;">N° de facture</td>
                    <td style="padding:12px 16px;font-size:14px;color:#111827;text-align:right;font-weight:600;">${d.number}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;font-size:14px;color:#6B7280;border-top:1px solid #E5E7EB;">Date</td>
                    <td style="padding:12px 16px;font-size:14px;color:#111827;text-align:right;border-top:1px solid #E5E7EB;">${date}</td>
                  </tr>
                  <tr>
                    <td style="padding:12px 16px;font-size:15px;color:#111827;font-weight:700;border-top:1px solid #E5E7EB;">Total TTC</td>
                    <td style="padding:12px 16px;font-size:15px;color:${BRAND_COLOR};text-align:right;font-weight:700;border-top:1px solid #E5E7EB;">${euros(d.totalTtc)}</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="margin:0;font-size:14px;line-height:1.5;color:#6B7280;text-align:center;">
                  Une question sur votre commande ? Répondez simplement à cet e-mail.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #E5E7EB;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#9CA3AF;text-align:center;">
                  © ${new Date().getFullYear()} ${APP_NAME}. Tous droits réservés.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
};

export const sendInvoiceMail = async (to: string, d: InvoiceMailData, pdf: Buffer) => {
  const { data, error } = await resend.emails.send({
    from: MAIL_FROM,
    to,
    subject: `Votre facture ${d.number} — ${d.shopName}`,
    html: invoiceMailTemplate(d),
    text: `Bonjour ${d.clientName},\n\nVous trouverez ci-joint votre facture ${d.number} du ${d.date.toLocaleDateString("fr-FR")} d'un montant de ${euros(d.totalTtc)}.\n\n${APP_NAME}`,
    attachments: [{ filename: `${d.number}.pdf`, content: pdf }],
  });

  if (error) throw new Error(`resend error: ${error.message}`);
  return data;
};




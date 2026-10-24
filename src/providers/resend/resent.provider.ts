import { Resend } from "resend";
import { OTP_PERIOD } from "../../utils/otp";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAIL_FROM = "Localhost <resend@leleblaise.com>";
const APP_NAME = "Localhost";
const BRAND_COLOR = "#4F46E5";

// Le nom vient de l'utilisateur : on l'echappe avant de l'injecter dans le HTML
const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const otpMailTemplate = (otp: string, name: string, minutes: number) => {
  const safeName = escapeHtml(name);
  const digits = otp
    .split("")
    .map(
      (d) =>
        `<td style="padding:0 4px;"><div style="width:44px;height:56px;line-height:56px;border-radius:10px;background:#F3F4F6;border:1px solid #E5E7EB;font-size:28px;font-weight:700;color:#111827;text-align:center;font-family:'Courier New',monospace;">${d}</div></td>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="fr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Votre code de vérification</title>
  </head>
  <body style="margin:0;padding:0;background:#F9FAFB;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;">Votre code ${APP_NAME} : ${otp} (valable ${minutes} min)</div>
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
                  Merci de vous être inscrit sur ${APP_NAME}. Pour confirmer votre adresse e-mail, saisissez le code ci-dessous :
                </p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding:0 32px;">
                <table role="presentation" cellpadding="0" cellspacing="0"><tr>${digits}</tr></table>
              </td>
            </tr>
            <tr>
              <td style="padding:24px 32px 32px;">
                <p style="margin:0 0 16px;font-size:14px;color:#6B7280;text-align:center;">
                  Ce code expire dans <strong style="color:#111827;">${minutes} minute${minutes > 1 ? "s" : ""}</strong>.
                </p>
                <p style="margin:0;padding:12px 16px;background:#FEF3C7;border-radius:8px;font-size:13px;line-height:1.5;color:#92400E;">
                  Ne partagez jamais ce code. ${APP_NAME} ne vous le demandera jamais par téléphone ou par e-mail.
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 32px;border-top:1px solid #E5E7EB;">
                <p style="margin:0;font-size:12px;line-height:1.5;color:#9CA3AF;text-align:center;">
                  Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet e-mail.<br />
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

export const sendOtpMail = async (to: string, otp: string, name: string) => {
  const minutes = Math.max(1, Math.round(OTP_PERIOD / 60));

  const { data, error } = await resend.emails.send({
    from: MAIL_FROM,
    to,
    subject: `${otp} est votre code de vérification ${APP_NAME}`,
    html: otpMailTemplate(otp, name, minutes),
    text: `Bonjour ${name},\n\nVotre code de vérification ${APP_NAME} est : ${otp}\nIl expire dans ${minutes} minute(s).\n\nSi vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail.`,
  });

  if (error) {
    throw new Error(`resend error: ${error.message}`);
  }

  return data;
};

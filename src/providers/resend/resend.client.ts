import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY);
export const MAIL_FROM = "Localhost <resend@leleblaise.com>";
export const APP_NAME = "Localhost";
export const BRAND_COLOR = "#4F46E5";

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
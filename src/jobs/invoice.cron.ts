import cron from "node-cron";
import { sendPendingInvoices } from "./send-invoice.job";

export const StartInvoiceCron = () => {
  const task = cron.schedule(
    "*/1 * * * *",
    async () => {
      console.log("[Cron] Debut du traitement des factures");

      try {
        await sendPendingInvoices();
      } catch (error) {
        console.error("[Cron] Erreur lors du traitement", error);

        task.stop();
      }
    },
    {
      timezone: "Africa/Douala",
      noOverlap: true,
    },
  );

  return task;
};

import "dotenv/config";
import prisma from "./config/prisma";
import app from "./app";
import { StartInvoiceCron } from "./jobs/invoice.cron";

const PORT = process.env.PORT ?? 3001;

const start = async () => {
  try {
    await prisma.$connect();
    console.log("Connection a la BD reussie");

    app.listen(PORT, () => {
      console.log(`Our application is listening on http://localhost:${PORT}`);

      StartInvoiceCron();
    });
  } catch (error) {
    console.error("starting failed", error);
    process.exit(1);
  }
};

start();

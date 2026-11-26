import bcrypt from "bcrypt";
import prisma from "../src/config/prisma";
import { randomUUID } from "node:crypto";
import { InvoiceStatus } from "../src/generated/prisma/enums";
import { error } from "node:console";

const userToCreate = [
  {
    firstName: "Blaise",
    lastName: "Lele",
    email: "blaiselele221@gmail.com",
  },
  {
    firstName: "Kevin",
    lastName: "Kuikoua",
    email: "kuikouakevin237@gmail.com",
  },
  {
    firstName: "Marie",
    lastName: "Happi",
    email: "leugouemarie@yahoo.fr",
  },
];

const main = async () => {
  const password = await bcrypt.hash("password123", 10);

  for (const [index, data] of userToCreate.entries()) {
    const result = await prisma.$transaction(async (tx) => {
      // Creer les users
      const user = await tx.user.upsert({
        where: {
          email: data.email,
        },
        update: {},
        create: {
          first_name: data.firstName,
          last_name: data.lastName,
          email: data.email,
          password: password,
          isVerified: true,
          phone_number: `655522${index + 1}`,
        },
      });

      // Boutiques
      const shop = await tx.shop.upsert({
        where: { owner: user.id },
        update: {},
        create: {
          name: `Boutique- ${user.first_name}`,
          description: "Description test",
          owner: user.id,
        },
      });

      const customer = await tx.client.upsert({
        where: {
          email: data.email,
        },
        update: {},
        create: {
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone_number: `655151${index + 1}`,
          country: "Cameroun",
          town: "Douala",
          adress: "Akwa",
        },
      });

      // Produit vendu par la boutique

      const products = await tx.product.create({
        data: {
          name: `Product ${data.firstName}`,
          short_decription: "description",
          price: 2500,
          quantity: 10,
          min_quantity: 2,
          shopId: shop.id,
          promo_price: 1000,
          description: "products",
        },
      });

      // creer le panier
      const cart = await tx.cart.create({
        data: {
          cartProducts: {
            create: {
              productId: products.id,
              quantity: 10,
              unit_price: 2500,
            },
          },
        },
      });

      const order = await tx.order.create({
        data: {
          clientId: customer.id,
          cartId: cart.id,
          delivery_info: {
            country: "Cameroun",
            town: "Douala",
            adress: "adresse",
          },
        },
      });

      // creer une facture
      const invoice = await tx.invoice.create({
        data: {
          number: `${randomUUID()}`,
          orderId: order.id,
          shopId: shop.id,
          total_ht: 10000,
          tva: 19,
          total_ttc: 12000,
          status: InvoiceStatus.PROCESSING,
        },
      });

      return {
        emai: customer.email,
        invoice,
      };
    });

    console.log("seed termine");
  }
};

main().catch((error) => {
  console.error("echec su seed", error);
  process.exitCode = 1;
}).finally(async () => {
    await prisma.$disconnect()
})

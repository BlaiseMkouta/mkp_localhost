import { randomUUID } from "node:crypto";
import prisma from "../../config/prisma";
import { InvoiceStatus } from "../../generated/prisma/enums";

export const createOrderInvoice = async (orderId: string, shopId: string) => {
  return prisma.$transaction(async (tx) => {
    const order = await tx.order.findFirstOrThrow({
      where: { id: orderId },
      include: { cart: { include: { cartProducts: true } } },
    });

    const total_ht = order.cart.cartProducts.reduce(
      (sum, cp) => sum + cp.unit_price * cp.quantity,
      0,
    );

    const tva = Math.round(total_ht * 0.19);

    const number = randomUUID();

    return tx.invoice.create({
      data: {
        number,
        orderId,
        shopId,
        total_ht,
        tva,
        total_ttc: total_ht + tva,
        status: InvoiceStatus.PROCESSING,
      },
    });
  });
};

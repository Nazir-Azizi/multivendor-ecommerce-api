/*
  Warnings:

  - A unique constraint covering the columns `[product_id,cart_id]` on the table `Cart_Item` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Cart_Item_product_id_cart_id_key" ON "Cart_Item"("product_id", "cart_id");

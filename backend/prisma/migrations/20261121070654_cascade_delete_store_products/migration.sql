-- DropForeignKey
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Cart_Item" DROP CONSTRAINT "Cart_Item_cart_id_fkey";

-- DropForeignKey
ALTER TABLE "Cart_Item" DROP CONSTRAINT "Cart_Item_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_Item" DROP CONSTRAINT "Order_Item_order_id_fkey";

-- DropForeignKey
ALTER TABLE "Order_Item" DROP CONSTRAINT "Order_Item_product_id_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_store_id_fkey";

-- DropForeignKey
ALTER TABLE "Store" DROP CONSTRAINT "Store_owner_id_fkey";

-- AddForeignKey
ALTER TABLE "Store" ADD CONSTRAINT "Store_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Item" ADD CONSTRAINT "Cart_Item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart_Item" ADD CONSTRAINT "Cart_Item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order_Item" ADD CONSTRAINT "Order_Item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

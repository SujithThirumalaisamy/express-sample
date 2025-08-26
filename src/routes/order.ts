import { Router } from "express";
import db from "../db";

const router = Router();

router.post("/", async (req, res) => {
  const { productId, userId, quantity } = req.body;
  if (!productId || quantity == null)
    return res
      .status(400)
      .json({ message: "Product ID and Quantity are required" });

  const product = await db.product.findUnique({
    where: { id: productId },
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  if (product.availableQuantity < quantity)
    return res
      .status(400)
      .json({ message: "Insufficient product quantity available" });

  const order = await db.order.create({
    data: {
      userId: userId,
      productId: productId,
      qty: Number(quantity),
      orderPrice: Number(product.price) * Number(quantity),
    },
  });

  await db.product.update({
    where: { id: productId },
    data: {
      availableQuantity: product.availableQuantity - quantity,
    },
  });

  res.status(201).json({ message: "Order created successfully", order });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const order = await db.order.findUnique({
    where: { id },
    include: { product: true },
  });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json(order);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!status) return res.status(400).json({ message: "Status is required" });
  const order = await db.order.update({
    where: { id },
    data: { status },
  });
  if (!order) return res.status(404).json({ message: "Order not found" });
  res.json({ message: "Order updated successfully", order });
});

//Yeah here we don't need delete because we just mark it as cancelled!

export default router;

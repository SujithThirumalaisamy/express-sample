import { Router } from "express";
import db from "../db";

const router = Router();

router.get("/", async (req, res) => {
  const products = await db.product.findMany();
  res.json(products);
});

router.post("/", async (req, res) => {
  const { name, description, price } = req.body;
  if (!name || !description || price == null)
    return res
      .status(400)
      .json({ message: "Name, Description and Price are required" });
  const product = await db.product.create({
    data: { name, description, price, availableQuantity: 10 },
  });
  res.status(201).json({ message: "Product created successfully", product });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await db.product.findUnique({
    where: { id },
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await db.product.update({
    where: { id },
    data: { ...req.body },
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product updated successfully", product });
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const product = await db.product.delete({
    where: { id },
  });
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json({ message: "Product deleted successfully" });
});

export default router;

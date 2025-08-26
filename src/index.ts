import express from "express";
import type { Request, Response } from "express";
import SwaggerUI from "swagger-ui-express";

import SwaggerDocument from "./swagger";
import ProductsRouter from "./routes/product";
import AuthRouter from "./routes/auth";
import OrdersRouter from "./routes/order";

import "dotenv/config";
const app = express();

app.get("/health", (req: Request, res: Response) => {
  res.send("The server is healthy!");
});

app.use("/", SwaggerUI.serve, SwaggerUI.setup(SwaggerDocument));

app.use(express.json());
app.use("/products", ProductsRouter);
app.use("/auth", AuthRouter);
app.use("/orders", OrdersRouter);

const PORT = process.env.PORT || 3000;

app.listen(3000, "0.0.0.0", () => {
  console.log(`App is listening on port ${PORT}`);
});

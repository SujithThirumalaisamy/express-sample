import { Router } from "express";
import SwaggerUI from "swagger-ui-express";
import SwaggerDocument from "../swagger";
import ProductsRouter from "./product";
import AuthRouter from "./auth";
import OrdersRouter from "./order";

const v1Router = Router();

v1Router.get("/health", (req, res) => {
  res.json({ status: "The server is healthy!" });
});

v1Router.use("/docs", SwaggerUI.serve, SwaggerUI.setup(SwaggerDocument));

v1Router.use("/auth", AuthRouter);
v1Router.use("/products", ProductsRouter);
v1Router.use("/orders", OrdersRouter);

export default v1Router;

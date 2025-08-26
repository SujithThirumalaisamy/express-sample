import express from "express";
import type { Request, Response } from "express";
import v1Router from "./routes/v1";

import "dotenv/config";
const app = express();

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "The server is healthy!" });
});

app.use(express.json());

app.use("/v1", v1Router);

const PORT = process.env.PORT || 3000;

app.listen(3000, "0.0.0.0", () => {
  console.log(`App is listening on port ${PORT}`);
});

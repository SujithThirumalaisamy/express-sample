import express from "express";
import type { Request, Response } from "express";
import v1Router from "./routes/v1";

import "dotenv/config";
const app = express();

app.get("/", (req: Request, res: Response) => {
  res.redirect("/v1/docs");
});

app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "The server is healthy!" });
});

app.use(express.json());

app.use("/v1", v1Router);

const PORT = Number(process.env.X_ZOHO_CATALYST_LISTEN_PORT) || 3000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`App is listening on port ${PORT}`);
});

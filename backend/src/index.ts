import dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import { initDatabase } from "./database/init";
import expensesRouter from "./routes/expenses";

dotenv.config({ path: "../.env" });

const app = express();
const PORT = process.env.PORT || 3000;

initDatabase();

app.use(cors());
app.use(express.json());

app.use("/api/expenses", expensesRouter);

app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

import { Router, Request, Response } from "express";
import { parseExpense } from "../services/aiService";
import {
  createExpense,
  getAllExpenses,
  deleteExpense,
} from "../database/expenses";
import { ExpenseInput } from "../types";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { input } = req.body;

    if (!input || typeof input !== "string" || input.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Please provide expense details in the "input" field.',
      });
    }

    const parsed = await parseExpense(input);

    const expenseInput: ExpenseInput = {
      amount: parsed.amount,
      currency: parsed.currency,
      category: parsed.category,
      description: parsed.description,
      merchant: parsed.merchant,
      original_input: input,
    };

    const expense = createExpense(expenseInput);

    return res.status(201).json({
      success: true,
      expense,
    });
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      error: error.message || "Failed to add expense. Please try again.",
    });
  }
});

router.get("/", (req: Request, res: Response) => {
  try {
    const expenses = getAllExpenses();
    return res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: "Failed to fetch expenses. Please try again.",
    });
  }
});

router.delete("/:id", (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid expense ID.",
      });
    }

    const deleted = deleteExpense(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        error: "Expense not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
      id,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: "Failed to delete expense. Please try again.",
    });
  }
});

export default router;

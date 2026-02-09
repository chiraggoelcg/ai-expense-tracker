import { db } from "./init";
import { Expense, ExpenseInput } from "../types";

export const createExpense = (expense: ExpenseInput): Expense => {
  const stmt = db.prepare(`
    INSERT INTO expenses (amount, currency, category, description, merchant, original_input)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const info = stmt.run(
    expense.amount,
    expense.currency,
    expense.category,
    expense.description,
    expense.merchant,
    expense.original_input,
  );

  const created = db
    .prepare("SELECT * FROM expenses WHERE id = ?")
    .get(info.lastInsertRowid) as Expense;
  return created;
};

export const getAllExpenses = (): Expense[] => {
  const stmt = db.prepare("SELECT * FROM expenses ORDER BY created_at DESC");
  return stmt.all() as Expense[];
};

export const deleteExpense = (id: number): boolean => {
  const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
  const info = stmt.run(id);
  return info.changes > 0;
};

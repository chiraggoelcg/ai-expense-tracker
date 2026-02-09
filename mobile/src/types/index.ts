export interface Expense {
  id: number;
  amount: number;
  currency: string;
  category: string;
  description: string;
  merchant: string | null;
  original_input: string;
  created_at: string;
}

export interface ApiResponse<T> {
  success: boolean;
  expenses?: T[];
  expense?: T;
  error?: string;
  message?: string;
}

import axios from "axios";
import Constants from "expo-constants";
import { Expense, ApiResponse } from "../types";

const API_URL = Constants.expoConfig?.extra?.apiUrl || "http://localhost:3000";
const TIMEOUT = 10000;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

export const api = {
  async getExpenses(): Promise<Expense[]> {
    try {
      const response =
        await apiClient.get<ApiResponse<Expense>>("/api/expenses");
      return response.data.expenses || [];
    } catch (error: any) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout. Please check your connection.");
      }
      if (error.response) {
        throw new Error(
          error.response.data.error || "Failed to fetch expenses",
        );
      }
      throw new Error("Network error. Please check if backend is running.");
    }
  },

  async addExpense(input: string): Promise<Expense> {
    try {
      const response = await apiClient.post<ApiResponse<Expense>>(
        "/api/expenses",
        { input },
      );

      if (!response.data.expense) {
        throw new Error(response.data.error || "Failed to add expense");
      }

      return response.data.expense;
    } catch (error: any) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout. AI is taking too long to respond.");
      }
      if (error.response) {
        throw new Error(error.response.data.error || "Failed to add expense");
      }
      throw new Error("Network error. Please check if backend is running.");
    }
  },

  async deleteExpense(id: number): Promise<void> {
    try {
      await apiClient.delete(`/api/expenses/${id}`);
    } catch (error: any) {
      if (error.code === "ECONNABORTED") {
        throw new Error("Request timeout. Please try again.");
      }
      if (error.response) {
        throw new Error(
          error.response.data.error || "Failed to delete expense",
        );
      }
      throw new Error("Network error. Please check if backend is running.");
    }
  },
};

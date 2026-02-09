import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Expense } from "../types";

interface Props {
  expense: Expense;
  onDelete: (id: number) => void;
}

const categoryEmojis: Record<string, string> = {
  "Food & Dining": "🍔",
  Transport: "🚗",
  Shopping: "🛒",
  Entertainment: "📺",
  "Bills & Utilities": "📄",
  Health: "💊",
  Travel: "✈️",
  Other: "📦",
};

const categoryColors: Record<string, string> = {
  "Food & Dining": "#FF6B6B",
  Transport: "#4ECDC4",
  Shopping: "#45B7D1",
  Entertainment: "#FFA07A",
  "Bills & Utilities": "#98D8C8",
  Health: "#F7DC6F",
  Travel: "#A29BFE",
  Other: "#B8B8B8",
};

export const ExpenseItem: React.FC<Props> = ({ expense, onDelete }) => {
  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  };

  const handleDelete = () => {
    onDelete(expense.id);
  };

  return (
    <View style={[styles.container]}>
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            { backgroundColor: categoryColors[expense.category] },
          ]}
        >
          <Text style={styles.emoji}>{categoryEmojis[expense.category]}</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.description} numberOfLines={1}>
            {expense.description || expense.merchant || "Expense"}
          </Text>
          <Text style={styles.category}>{expense.category}</Text>
          {expense.merchant && (
            <Text style={styles.merchant}>at {expense.merchant}</Text>
          )}
          <Text style={styles.timeAgo}>
            {formatTimeAgo(expense.created_at)}
          </Text>
        </View>
      </View>
      <View style={styles.rightSection}>
        <Text style={styles.amount}>₹{expense.amount.toFixed(2)}</Text>
        <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
          <Text style={styles.deleteText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  leftSection: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  emoji: {
    fontSize: 24,
  },
  details: {
    flex: 1,
  },
  description: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 4,
  },
  category: {
    fontSize: 13,
    color: "#7F8C8D",
    marginBottom: 2,
  },
  merchant: {
    fontSize: 12,
    color: "#95A5A6",
    fontStyle: "italic",
    marginBottom: 4,
  },
  timeAgo: {
    fontSize: 11,
    color: "#BDC3C7",
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingLeft: 8,
  },
  amount: {
    fontSize: 20,
    fontWeight: "700",
    color: "#27AE60",
    marginBottom: 8,
  },
  deleteButton: {
    padding: 8,
    minWidth: 32,
    alignItems: "center",
  },
  deleteText: {
    fontSize: 20,
  },
});

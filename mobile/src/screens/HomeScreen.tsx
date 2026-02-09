import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
} from "react-native";
import { api } from "../services/api";
import { ExpenseItem } from "../components/ExpenseItem";
import { SuccessCard } from "../components/SuccessCard";
import { Expense } from "../types";

export const HomeScreen: React.FC = () => {
  const [inputText, setInputText] = useState("");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successExpense, setSuccessExpense] = useState<Expense | null>(null);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await api.getExpenses();
      setExpenses(data);
    } catch (error: any) {
      Alert.alert("Error", error.message || "Failed to load expenses");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadExpenses();
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      Alert.alert("Empty Input", "Please enter an expense description");
      return;
    }

    try {
      setSubmitting(true);
      const newExpense = await api.addExpense(inputText);
      setExpenses([newExpense, ...expenses]);
      setInputText("");
      setSuccessExpense(newExpense);
      Keyboard.dismiss();
    } catch (error: any) {
      Alert.alert(
        "Could Not Parse Expense",
        error.message ||
          'Please try again.\n\nExample: "uber to office 350 rupees"',
        [{ text: "OK" }],
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = useCallback((id: number) => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await api.deleteExpense(id);
              setExpenses((prevExpenses) =>
                prevExpenses.filter((e) => e.id !== id),
              );
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to delete expense");
            }
          },
        },
      ],
    );
  }, []);

  const getTotalExpenses = () => {
    return expenses.reduce((sum, exp) => sum + exp.amount, 0);
  };

  const quickExamples = ["coffee 250", "uber 350", "groceries 1500"];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <StatusBar barStyle="light-content" backgroundColor="#3498DB" />

      <View style={styles.header}>
        <Text style={styles.title}>💰 AI Expense Tracker</Text>
        <Text style={styles.subtitle}>Add expenses in plain English</Text>
        {expenses.length > 0 && (
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Total Spent</Text>
            <Text style={styles.totalAmount}>
              ₹{getTotalExpenses().toFixed(2)}
            </Text>
            <Text style={styles.totalCount}>
              {expenses.length} expense{expenses.length !== 1 ? "s" : ""}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder='e.g., "uber to office 350 rupees"'
          placeholderTextColor="#95A5A6"
          value={inputText}
          onChangeText={setInputText}
          editable={!submitting}
          multiline
          maxLength={200}
          returnKeyType="send"
          onSubmitEditing={handleSubmit}
        />
        <TouchableOpacity
          style={[styles.button, submitting && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={submitting || !inputText.trim()}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.buttonText}>Add</Text>
          )}
        </TouchableOpacity>
      </View>

      {successExpense && (
        <SuccessCard
          expense={successExpense}
          onDismiss={() => setSuccessExpense(null)}
        />
      )}

      <View style={styles.examplesContainer}>
        <Text style={styles.examplesTitle}>💡 Quick examples:</Text>
        <View style={styles.exampleTags}>
          {quickExamples.map((example, i) => (
            <TouchableOpacity
              key={i}
              style={styles.exampleTag}
              onPress={() => setInputText(example)}
            >
              <Text style={styles.exampleText}>{example}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && expenses.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3498DB" />
          <Text style={styles.loadingText}>Loading expenses...</Text>
        </View>
      ) : (
        <FlatList
          data={expenses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ExpenseItem expense={item} onDelete={handleDelete} />
          )}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor="#3498DB"
              colors={["#3498DB"]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyEmoji}>📝</Text>
              <Text style={styles.emptyText}>No expenses yet</Text>
              <Text style={styles.emptySubtext}>
                Add your first expense using natural language above!
              </Text>
            </View>
          }
        />
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  header: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#3498DB",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#ECF0F1",
    marginBottom: 16,
  },
  totalContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    padding: 12,
    borderRadius: 8,
  },
  totalLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 4,
  },
  totalAmount: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },
  totalCount: {
    color: "#ECF0F1",
    fontSize: 12,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 96,
    borderWidth: 1,
    borderColor: "#D5D8DC",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    backgroundColor: "#F8F9FA",
  },
  button: {
    marginLeft: 12,
    backgroundColor: "#27AE60",
    paddingHorizontal: 24,
    borderRadius: 12,
    justifyContent: "center",
    minWidth: 80,
    height: 48,
  },
  buttonDisabled: {
    backgroundColor: "#95A5A6",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  examplesContainer: {
    padding: 16,
    paddingTop: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  examplesTitle: {
    fontSize: 12,
    color: "#7F8C8D",
    marginBottom: 8,
  },
  exampleTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  exampleTag: {
    backgroundColor: "#EBF5FB",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D6EAF8",
  },
  exampleText: {
    color: "#3498DB",
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#7F8C8D",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 60,
    paddingHorizontal: 40,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#2C3E50",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#7F8C8D",
    textAlign: "center",
    lineHeight: 20,
  },
});

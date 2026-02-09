import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { Expense } from "../types";

interface Props {
  expense: Expense;
  onDismiss: () => void;
}

export const SuccessCard: React.FC<Props> = ({ expense, onDismiss }) => {
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    const timer = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.header}>
        <Text style={styles.checkmark}>✓</Text>
        <Text style={styles.title}>Expense Added!</Text>
      </View>
      <View style={styles.details}>
        <View style={styles.row}>
          <Text style={styles.label}>Amount:</Text>
          <Text style={styles.value}>₹{expense.amount.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Category:</Text>
          <Text style={styles.value}>{expense.category}</Text>
        </View>
        {expense.merchant && (
          <View style={styles.row}>
            <Text style={styles.label}>Merchant:</Text>
            <Text style={styles.value}>{expense.merchant}</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 16,
    marginTop: 8,
    padding: 16,
    backgroundColor: "#D5F4E6",
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: "#27AE60",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  checkmark: {
    fontSize: 24,
    color: "#27AE60",
    marginRight: 8,
    fontWeight: "700",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#27AE60",
  },
  details: {
    gap: 6,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    fontSize: 13,
    color: "#555",
    fontWeight: "600",
    width: 90,
  },
  value: {
    fontSize: 13,
    color: "#333",
    fontWeight: "500",
  },
});

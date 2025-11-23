import { create } from "zustand";

interface CalculatorState {
  display: string;
  clear: () => void;
  deleteLast: () => void;
  inputValue: (value: string) => void;
  calculate: () => void;
}

export const useCalculator = create<CalculatorState>((set, get) => ({
  display: "0",

  clear: () => set({ display: "0" }),

  deleteLast: () => {
    const { display } = get();
    if (display.length === 1 || display === "Error") {
      set({ display: "0" });
    } else {
      set({ display: display.slice(0, -1) || "0" });
    }
  },

  inputValue: (value) => {
    const { display } = get();
    const lastChar = display[display.length - 1];
    const operators = ["+", "-", "×", "÷"];

    // Prevent starting with operator except '-'
    if (display === "0" && operators.includes(value) && value !== "-") {
      return;
    }

    // Prevent two operators in a row (except replacing one)
    if (operators.includes(lastChar) && operators.includes(value)) {
      if (value === "-") {
        // Allow negative numbers after operator: 5 × -3
        if (lastChar !== "-") {
          set({ display: display + value });
        }
      } else {
        // Replace last operator
        set({ display: display.slice(0, -1) + value });
      }
      return;
    }

    // Handle decimal point
    if (value === ".") {
      const lastNumber = display.split(/[\+\-\×\÷]/).pop() || "";
      if (lastNumber.includes(".")) return;
      if (operators.includes(lastChar) || display === "0") {
        set({ display: display === "0" ? "0." : display + "0." });
        return;
      }
    }

    // Replace initial 0
    if (display === "0" && !operators.includes(value) && value !== ".") {
      set({ display: value });
    } else {
      set({ display: display + value });
    }
  },

  calculate: () => {
    let { display } = get();
    if (!display || display === "Error") return;

    // Replace × and ÷ with * and /
    let expression = display.replace(/×/g, "*").replace(/÷/g, "/");

    try {
      // Use Function constructor for safety over eval
      const result = Function('"use strict"; return (' + expression + ")")();
      const resultStr = Number.isInteger(result)
        ? result.toString()
        : parseFloat(result.toFixed(8)).toString();

      set({
        display: resultStr === "NaN" || !isFinite(result) ? "Error" : resultStr,
      });
    } catch {
      set({ display: "Error" });
    }
  },
}));

import { useEffect } from "react";
import { useCalculator } from "./store/useCalculator";

function App() {
  const { display, inputValue, calculate, clear, deleteLast } = useCalculator();

  const buttons = [
    ["AC", "←", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const handleClick = (value: string) => {
    if (value === "AC") {
      clear();
    } else if (value === "←") {
      deleteLast();
    } else if (value === "=") {
      calculate();
    } else if (value === "%") {
      inputValue("/100");
      setTimeout(calculate, 0);
    } else {
      inputValue(value);
    }
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key >= "0" && e.key <= "9") inputValue(e.key);
      if (e.key === ".") inputValue(".");
      if (e.key === "+") inputValue("+");
      if (e.key === "-") inputValue("-");
      if (e.key === "*") inputValue("×");
      if (e.key === "/") {
        e.preventDefault();
        inputValue("÷");
      }
      if (e.key === "Enter" || e.key === "=") calculate();
      if (e.key === "Backspace") deleteLast();
      if (e.key === "Escape") clear();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [inputValue, calculate, deleteLast, clear]);

  return (
    <>
      <div className="min-h-screen bg-black flex items-center justify-center px-3 sm:px-4">
        <div className="bg-[#1c1c1c] rounded-3xl shadow-2xl p-6 w-full max-w-xs">
          {/* Display */}
          <div className="rounded-2xl mb-6 text-right h-36 flex items-end justify-end">
            <p className="text-white text-5xl font-light truncate">
              {display || "0"}
            </p>
          </div>

          {/* Buttons */}
          <div className="grid grid-cols-4 gap-3">
            {buttons.map((row) =>
              row.map((btn) => {
                const isZero = btn === "0";
                const isOperator = ["÷", "×", "-", "+", "="].includes(btn);
                const isTop = ["AC", "←", "%"].includes(btn);

                return (
                  <button
                    key={btn}
                    onClick={() => handleClick(btn)}
                    className={`
                      ${isZero ? "col-span-2" : ""}
                      ${
                        isOperator
                          ? "bg-[#ff9500] hover:bg-[#ff9500]/80 text-white"
                          : isTop
                          ? "bg-[#d4d4d2] hover:bg-[#d4d4d2]/80 text-black"
                          : "bg-[#505050] hover:bg-[#505050]/80 text-white"
                      }
                      text-2xl font-medium rounded-full h-16 transition-all active:scale-95
                    `}
                  >
                    {btn === "AC" ? "AC" : btn === "←" ? "←" : btn}
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

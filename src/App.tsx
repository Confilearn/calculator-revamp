import { useEffect } from "react";
import { useCalculator } from "./store/useCalculator";

function App() {
  const { display, inputValue, calculate, clear, deleteLast } = useCalculator();

  const buttons = [
    ["C", "←", "%", "÷"],
    ["7", "8", "9", "×"],
    ["4", "5", "6", "-"],
    ["1", "2", "3", "+"],
    ["0", ".", "="],
  ];

  const handleClick = (value: string) => {
    if (value === "C") {
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
      <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center px-1 sm:px-4">
        <div className="bg-black rounded-3xl shadow-2xl p-4 py-6 w-full max-w-xs">
          {/* Display */}
          <div className="rounded-2xl mb-6 text-right h-38 flex items-end justify-end">
            <p className="text-white text-6xl font-light truncate">
              {(() => {
                const val = display || "0";
                return val.replace(/-?\d+(\.\d+)?/g, (num) => {
                  const [intPart, dec] = num.split(".");
                  const sign = intPart.startsWith("-") ? "-" : "";
                  const absInt = sign ? intPart.slice(1) : intPart;
                  const formattedInt = absInt.replace(
                    /\B(?=(\d{3})+(?!\d))/g,
                    ","
                  );
                  return dec
                    ? `${sign}${formattedInt}.${dec}`
                    : `${sign}${formattedInt}`;
                });
              })()}
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
                          ? "bg-[#ff9f09] hover:bg-[#ff9f09]/80 text-white"
                          : isTop
                          ? "bg-[#a5a5a5] hover:bg-[#a5a5a5]/80 text-black"
                          : "bg-[#3c3c3c] hover:bg-[#3c3c3c]/80 text-white"
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

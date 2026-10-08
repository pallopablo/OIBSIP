
const expressionDisplay = document.getElementById("expression");
const resultDisplay = document.getElementById("result");
const buttons = document.querySelectorAll("button");


let currentInput = "";
let storedValue = null;
let operator = null;
let justCalculated = false;
let errorState = false;


function updateDisplay() {
  expressionDisplay.textContent =
    storedValue !== null && operator
      ? `${formatNumber(storedValue)} ${getSymbol(operator)}`
      : "0";

  resultDisplay.textContent =
    currentInput === "" ? "0" : currentInput;
}


function getSymbol(op) {
  switch (op) {
    case "+":
      return "+";
    case "-":
      return "−";
    case "*":
      return "×";
    case "/":
      return "÷";
    case "%":
      return "%";
    default:
      return "";
  }
}


function formatNumber(number) {
  if (!Number.isFinite(number)) return "Error";

  return String(parseFloat(number.toPrecision(12)));
}

function clearCalculator() {
  currentInput = "";
  storedValue = null;
  operator = null;
  justCalculated = false;
  errorState = false;

  updateDisplay();
}


function deleteLast() {
  if (errorState || justCalculated) {
    clearCalculator();
    return;
  }

  currentInput = currentInput.slice(0, -1);
  updateDisplay();
}


function appendNumber(number) {
  if (errorState) {
    clearCalculator();
  }

  if (justCalculated) {
    currentInput = "";
    storedValue = null;
    operator = null;
    justCalculated = false;
  }


  if (number === "." && currentInput.includes(".")) {
    return;
  }

  
  if (number === "." && currentInput === "") {
    currentInput = "0";
  }

 
  if (currentInput === "0" && number !== ".") {
    currentInput = "";
  }

  currentInput += number;

  updateDisplay();
}


function chooseOperator(nextOperator) {
  if (errorState) return;

  
  if (nextOperator === "%") {
    applyPercentage();
    return;
  }

  if (currentInput === "" && storedValue === null) {
    return;
  }

 
  if (currentInput === "" && storedValue !== null) {
    operator = nextOperator;
    updateDisplay();
    return;
  }

 
  if (storedValue !== null && operator !== null) {
    calculate();
  }

  storedValue = parseFloat(currentInput);
  operator = nextOperator;
  currentInput = "";

  justCalculated = false;

  updateDisplay();
}


function applyPercentage() {
  if (currentInput === "") return;

  const value = parseFloat(currentInput);

  if (isNaN(value)) return;

  currentInput = formatNumber(value / 100);
  updateDisplay();
}


function calculate() {
  if (
    storedValue === null ||
    operator === null ||
    currentInput === ""
  ) {
    return;
  }

  const firstNumber = storedValue;
  const secondNumber = parseFloat(currentInput);

  if (isNaN(firstNumber) || isNaN(secondNumber)) {
    showError("Invalid input");
    return;
  }

  let result;

  switch (operator) {
    case "+":
      result = firstNumber + secondNumber;
      break;

    case "-":
      result = firstNumber - secondNumber;
      break;

    case "*":
      result = firstNumber * secondNumber;
      break;

    case "/":
      if (secondNumber === 0) {
        showError("Cannot divide by zero");
        return;
      }

      result = firstNumber / secondNumber;
      break;

    default:
      return;
  }

  if (!Number.isFinite(result)) {
    showError("Error");
    return;
  }

  currentInput = formatNumber(result);
  storedValue = null;
  operator = null;
  justCalculated = true;

  updateDisplay();
}


function showError(message) {
  currentInput = message;
  storedValue = null;
  operator = null;
  errorState = true;
  justCalculated = false;

  updateDisplay();
}


buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const number = button.dataset.number;
    const operation = button.dataset.operation;
    const action = button.dataset.action;

    if (number !== undefined) {
      appendNumber(number);
    }

    if (operation) {
      chooseOperator(operation);
    }

    switch (action) {
      case "clear":
        clearCalculator();
        break;

      case "delete":
        deleteLast();
        break;

      case "equals":
        calculate();
        break;
    }
  });
});

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (/^[0-9.]$/.test(key)) {
    appendNumber(key);
  } else if (["+", "-", "*", "/"].includes(key)) {
    chooseOperator(key);
  } else if (key === "%") {
    applyPercentage();
  } else if (key === "Enter" || key === "=") {
    calculate();
  } else if (key === "Backspace") {
    deleteLast();
  } else if (key === "Escape") {
    clearCalculator();
  } else {
    return;
  }

  event.preventDefault();
});

updateDisplay();
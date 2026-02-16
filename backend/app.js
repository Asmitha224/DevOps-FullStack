const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// In-memory data (simple DB for assignment)
let expenses = [
  { id: 1, title: "Groceries", amount: 500 },
  { id: 2, title: "Fuel", amount: 300 },
];

let income = [
  { id: 1, source: "Salary", amount: 10000 },
  { id: 2, source: "Freelance", amount: 2000 },
];

// Utility: compute dashboard summary
function getDashboardSummary() {
  const totalExpenses = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const totalIncome = income.reduce((sum, i) => sum + Number(i.amount), 0);
  return {
    totalIncome,
    totalExpenses,
    balance: totalIncome - totalExpenses,
  };
}

// API 1: Dashboard summary
app.get('/api/dashboard', (req, res) => {
  res.json(getDashboardSummary());
});

// API 2: Expenses list
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// API 3: Income list
app.get('/api/income', (req, res) => {
  res.json(income);
});

// Expose internals for tests
const _internal = {
  _resetData: () => {
    expenses = [
      { id: 1, title: "Groceries", amount: 500 },
      { id: 2, title: "Fuel", amount: 300 },
    ];
    income = [
      { id: 1, source: "Salary", amount: 10000 },
      { id: 2, source: "Freelance", amount: 2000 },
    ];
  },
  _getData: () => ({ expenses, income }),
};

module.exports = app;
module.exports._internal = _internal;

const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Enable CORS to allow requests from the frontend
app.use(cors());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Backend server running on port 5000' });
});

// In-memory database to store expenses
let expenses = [
  { id: 1, name: 'Groceries', amount: 50 },
  { id: 2, name: 'Gas', amount: 30 },
];

// GET route to fetch all expenses
app.get('/api/expenses', (req, res) => {
  res.json(expenses);
});

// POST route to add a new expense
app.post('/api/expenses', (req, res) => {
  const { name, amount } = req.body;
  const newExpense = {
    id: expenses.length + 1,
    name,
    amount,
  };
  expenses.push(newExpense);
  res.status(201).json(newExpense);
});

// Start the server
app.listen(port, () => {
  console.log(`Backend server running on http://localhost:${port}`);
});

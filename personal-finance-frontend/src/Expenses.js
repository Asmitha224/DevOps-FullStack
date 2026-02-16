import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Expenses = () => {
  // State to store the list of expenses
  const [expenses, setExpenses] = useState([]);
  // State to store the new expense form data
  const [expenseData, setExpenseData] = useState({ name: '', amount: '' });

  // Fetch expenses when the component loads
  useEffect(() => {
    axios.get('http://localhost:5000/api/expenses')
      .then(response => {
        setExpenses(response.data);
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
      });
  }, []);

  // Handle input changes for the new expense form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission to add a new expense
  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/expenses', expenseData)
      .then(response => {
        setExpenses(prevExpenses => [...prevExpenses, response.data]);
        setExpenseData({ name: '', amount: '' }); // Reset the form
      })
      .catch(error => {
        console.error('Error adding expense:', error);
      });
  };

  return (
    <div>
      <h1>Expenses</h1>
      {/* Display the expenses */}
      <ul>
        {expenses.map(expense => (
          <li key={expense.id}>
            {expense.name}: ${expense.amount}
          </li>
        ))}
      </ul>

      {/* Form to add a new expense */}
      <h2>Add New Expense</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={expenseData.name}
          onChange={handleChange}
          placeholder="Expense Name"
          required
        />
        <input
          type="number"
          name="amount"
          value={expenseData.amount}
          onChange={handleChange}
          placeholder="Amount"
          required
        />
        <button type="submit">Add Expense</button>
      </form>
    </div>
  );
};

export default Expenses;

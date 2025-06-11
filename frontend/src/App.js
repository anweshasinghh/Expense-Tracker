import React, { useState } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title as ChartTitle
} from 'chart.js';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartTitle);

function App() {
  const [expenses, setExpenses] = useState([
    { id: 1, date: '2024-01-10', amount: 200, category: 'Food', description: 'Lunch' },
    { id: 2, date: '2024-02-15', amount: 50, category: 'Travel', description: 'Bus fare' },
    { id: 3, date: '2024-03-20', amount: 100, category: 'Shopping', description: 'Clothes' },
    { id: 4, date: '2024-03-25', amount: 80, category: 'Food', description: 'Snacks' },
    { id: 5, date: '2024-04-05', amount: 120, category: 'Bills', description: 'Electricity' },
    { id: 6, date: '2024-05-12', amount: 60, category: 'Travel', description: 'Taxi' },
    { id: 7, date: '2024-06-01', amount: 300, category: 'Food', description: 'Dinner' },
  ]);
  const [form, setForm] = useState({ date: '', amount: '', category: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({ date: '', amount: '', category: '', description: '' });
  const [income, setIncome] = useState(12000); // Example yearly income

  // Add expense
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = e => {
    e.preventDefault();
    if (!form.date || !form.amount || !form.category) return;
    setExpenses([
      ...expenses,
      { ...form, id: Date.now(), amount: parseFloat(form.amount) }
    ]);
    setForm({ date: '', amount: '', category: '', description: '' });
  };

  // Delete expense
  const handleDelete = id => setExpenses(expenses.filter(exp => exp.id !== id));

  // Edit expense
  const openEditModal = exp => {
    setEditId(exp.id);
    setEditForm({ ...exp });
    setShowEditModal(true);
  };
  const handleEditChange = e => setEditForm({ ...editForm, [e.target.name]: e.target.value });
  const handleEditSubmit = e => {
    e.preventDefault();
    setExpenses(expenses.map(exp => exp.id === editId ? { ...editForm, id: editId, amount: parseFloat(editForm.amount) } : exp));
    setShowEditModal(false);
  };

  // Pie chart data for all expenses
  const categoryTotals = {};
  expenses.forEach(exp => {
    categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
  });
  const pieData = {
    labels: Object.keys(categoryTotals),
    datasets: [
      {
        data: Object.values(categoryTotals),
        backgroundColor: [
          '#ff9800', '#ff5722', '#ffd600', '#ffa726', '#ffb300', '#ff7043', '#fffde7', '#ffe0b2'
        ],
        borderColor: '#222',
        borderWidth: 2,
      },
    ],
  };

  // Bar chart data for monthly expenses
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const monthlyTotals = Array(12).fill(0);
  expenses.forEach(exp => {
    const monthIdx = new Date(exp.date).getMonth();
    monthlyTotals[monthIdx] += exp.amount;
  });
  const barData = {
    labels: months,
    datasets: [
      {
        label: 'Expenses',
        data: monthlyTotals,
        backgroundColor: '#ff9800',
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  // Yearly summary
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const savings = income - totalSpent;

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <div className="header-row" style={{ justifyContent: 'center' }}>
            <h1>PERSONALIZED EXPENSE TRACKER</h1>
          </div>
          <nav className="dashboard-nav">
            <Link to="/">Home</Link>
            <Link to="/add">Add Expense</Link>
            <Link to="/yearly">Yearly Summary</Link>
          </nav>
        </header>
        <Routes>
          <Route path="/" element={
            <section className="pie-chart-section">
              <h2>All Expenses Breakdown</h2>
              <Pie data={pieData} />
            </section>
          } />
          <Route path="/add" element={
            <main>
              <section className="expense-form-section">
                <h2>Add Expense</h2>
                <form className="expense-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Date:</label>
                    <input type="date" name="date" value={form.date} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label>Amount:</label>
                    <input type="number" name="amount" value={form.amount} onChange={handleChange} placeholder="Amount" required min="0" />
                  </div>
                  <div className="form-group">
                    <label>Category:</label>
                    <input type="text" name="category" value={form.category} onChange={handleChange} placeholder="Category" required />
                  </div>
                  <div className="form-group">
                    <label>Description:</label>
                    <input type="text" name="description" value={form.description} onChange={handleChange} placeholder="Description" />
                  </div>
                  <button type="submit" className="add-btn">Add Expense</button>
                </form>
              </section>
              <section className="expense-list-section">
                <h2>Expenses</h2>
                <table className="expense-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Category</th>
                      <th>Amount</th>
                      <th>Description</th>
                      <th className="actions">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenses.map(exp => (
                      <tr key={exp.id}>
                        <td>{exp.date}</td>
                        <td>{exp.category}</td>
                        <td>₹{exp.amount}</td>
                        <td>{exp.description}</td>
                        <td className="actions">
                          <button className="edit-btn" onClick={() => openEditModal(exp)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete(exp.id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
              {/* Edit Modal */}
              {showEditModal && (
                <div className="modal-backdrop">
                  <div className="modal">
                    <h2>Edit Expense</h2>
                    <form className="expense-form" onSubmit={handleEditSubmit}>
                      <div className="form-group">
                        <label>Date:</label>
                        <input type="date" name="date" value={editForm.date} onChange={handleEditChange} required />
                      </div>
                      <div className="form-group">
                        <label>Amount:</label>
                        <input type="number" name="amount" value={editForm.amount} onChange={handleEditChange} required min="0" />
                      </div>
                      <div className="form-group">
                        <label>Category:</label>
                        <input type="text" name="category" value={editForm.category} onChange={handleEditChange} required />
                      </div>
                      <div className="form-group">
                        <label>Description:</label>
                        <input type="text" name="description" value={editForm.description} onChange={handleEditChange} />
                      </div>
                      <button type="submit" className="add-btn">Update</button>
                      <button type="button" className="delete-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
                    </form>
                  </div>
                </div>
              )}
            </main>
          } />
          <Route path="/yearly" element={
            <section className="pie-chart-section">
              <h2>Yearly Summary</h2>
              <Bar data={barData} />
              <div className="yearly-summary">
                <div>Total Expense (Year): <span className="spent">₹{totalSpent}</span></div>
                <div>Total Savings (Year): <span className={savings >= 0 ? 'savings' : 'negative'}>₹{savings}</span></div>
              </div>
            </section>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

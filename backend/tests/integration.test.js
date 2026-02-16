const request = require('supertest');
const app = require('../app');
const { _internal } = require('../app');

describe('Integration Tests - Personal Finance Tracker APIs', () => {
  beforeEach(() => {
    // Reset in-memory data before each test
    _internal._resetData();
  });

  test('Dashboard API returns correct summary data', async () => {
    const res = await request(app).get('/api/dashboard');

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('totalIncome');
    expect(res.body).toHaveProperty('totalExpenses');
    expect(res.body).toHaveProperty('balance');

    // Check correctness based on seeded data:
    // income: 10000 + 2000 = 12000
    // expenses: 500 + 300 = 800
    expect(res.body.totalIncome).toBe(12000);
    expect(res.body.totalExpenses).toBe(800);
    expect(res.body.balance).toBe(11200);
  });

  test('Expenses API returns seeded expenses', async () => {
    const res = await request(app).get('/api/expenses');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('title');
  });

  test('Income API returns seeded income', async () => {
    const res = await request(app).get('/api/income');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(2);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('source');
  });
});

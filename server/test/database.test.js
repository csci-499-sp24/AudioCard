const request = require('supertest');
const express = require('express');
const router = require('../routes/index'); 
const sequelize = require('../config/db');

const app = express();
app.use(express.json()); 

app.use('/api', router);

describe('Router', () => {
    afterAll(async () => {
        await sequelize.close(); 
      });
  it('should respond with status 200 for GET requests to /api/cardsets', async () => {
    const response = await request(app).get('/api/cardsets');
    expect(response.status).toBe(200);
  });

  it('should respond with status 404 for GET requests to non-existent routes', async () => {
    const response = await request(app).get('/api/nonexistent');
    expect(response.status).toBe(404);
  });

  it('should respond with status 500 for sign up request with invalid data', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({ invalid: 'data' }); // Send invalid data
    expect(response.status).toBe(500); // "Error signing up users"
  });
  it('should establish connection to the database', async () => {
    try {
      // Attempt a simple database query
      const [results] = await sequelize.query('SELECT 1+1 AS result');
      expect(results[0].result).toBe(2); // Check if query result is as expected
    } catch (error) {
      throw new Error('Database connection failed: ' + error.message);
    }
  });

});

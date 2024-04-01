const request = require('supertest');
const express = require('express');
const getEmail = require('./userTests'); 

const app = express();

describe('getEmail function', () => {
  it('Should return tan_test email', async () => {
    const userId = 30;
    
    const email = 'tan_test@gmail.com'; 
    const userEmail = await getEmail(userId);

    expect(userEmail).toBe(email);
  });
});

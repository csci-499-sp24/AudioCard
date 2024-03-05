const express = require("express");
const cors = require('cors')
const Sequelize = require('sequelize');
require('dotenv').config();

const app = express();
app.use(cors());

const port = process.env.PORT || 8080;

 const sequelize = new Sequelize(
    'my_db',
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        port: 3306,
        dialect: 'mysql',
    }
);

console.log('DB_USERNAME: ', process.env.DB_USERNAME);
console.log('DB_PASSWORD', process.env.DB_PASSWORD);
console.log('DB_HOST: ', process.env.DB_HOST);

app.get("/api/home", (req, res) => {
    res.json({message: "Hello World!"});
});

sequelize
  .authenticate()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
      console.log('Connection to the database has been established successfully.');
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  }); 

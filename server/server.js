const express = require("express");
const cors = require('cors')
const Sequelize = require('sequelize');
const config = require('./config');

const app = express();
app.use(cors());

const port = process.env.PORT || 8080;

const dbConfig = config.development; 

//const sequelize = new Sequelize('database-1.cxey2w8s8sk8.us-east-2.rds.amazonaws.com')

 const sequelize = new Sequelize(
    dbConfig.database,
    dbConfig.username,
    dbConfig.password,
    {
        host: dbConfig.host,
        port: dbConfig.port,
        dialect: dbConfig.dialect,
    }
);

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

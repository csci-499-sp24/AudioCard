const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/index');
const sequelize = require('./config/db');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', apiRoutes);

// Start the server
const PORT = process.env.PORT || 8080;
sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});
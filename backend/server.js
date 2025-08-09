const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();

dotenv.config();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the AniProject API Server!' });
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});
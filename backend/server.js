require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/db');
const { initRedis } = require('./utils/cache');
const journalRoutes = require('./routes/journalRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');

// Initialize app
const app = express();

// Database
connectDB();

// Cache
initRedis();

// Config
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api/', apiLimiter);

// Routes
app.use('/api/journal', journalRoutes);

// Status
app.get('/', (req, res) => {
  res.send('NatureJournal API is running...');
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

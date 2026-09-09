require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173'
  })
);

app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'GoFit'
  });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/workouts', require('./routes/workoutRoutes'));
app.use('/api/water', require('./routes/waterRoutes'));
app.use('/api/weight', require('./routes/weightRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Server error'
  });
});

const PORT = process.env.PORT || 5000;

// Export handler for serverless environments (e.g. Vercel)
module.exports = async (req, res) => {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('MongoDB connection failed:', error);

    return res.status(500).json({
      message: 'Database connection failed'
    });
  }
};

// Start local HTTP server when executed directly
if (require.main === module) {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`GoFit server running on port ${PORT}`);
      });
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error.message);
      app.listen(PORT, () => {
        console.log(`GoFit server running on port ${PORT} (Database disconnected)`);
      });
    });
}
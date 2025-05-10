const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const userRoutes = require('./route/userRoute');

connectDB();
const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
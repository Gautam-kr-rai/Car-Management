require('dotenv').config(); // Make sure this is at the very top
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path'); 
const authRoutes = require('./routes/authRoutes'); 
const carRoutes = require('./routes/carRoutes');
//const connectDB = require('./db');
const app = express();


const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection failed:', error);
  }
};

connectDB();
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors({
  origin: 'http://localhost:3000',  // Make sure your frontend can access the backend
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use('/auth', authRoutes); 
app.use('/cars', carRoutes); 

// app.get('/', (req, res) => {
//   res.json({message:'Hello World'})
// });


if (process.env.NODE_ENV === "Production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

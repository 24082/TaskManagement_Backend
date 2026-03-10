const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
require("dotenv").config();

const app = express();

connectDB();

// Fixed CORS configuration - removed trailing slash
app.use(cors({
  origin: "https://task-management-nine-jet.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000; // Added fallback port

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
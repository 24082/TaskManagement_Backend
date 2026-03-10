const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
require("dotenv").config();

const app = express();

connectDB();

// ✅ ONLY ONE CORS middleware - with your specific configuration
app.use(cors({
  origin: "https://task-management-nine-jet.vercel.app",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// ❌ REMOVE this line - it's overwriting your config above
// app.use(cors()); 

app.use(express.json());

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const taskRoutes = require("./routes/taskRoutes");
require("dotenv").config();

const app = express();

connectDB();

app.use(cors({
  origin: "https://task-management-nine-jet.vercel.app/",
}));

app.use(express.json());

app.use("/api/tasks", taskRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

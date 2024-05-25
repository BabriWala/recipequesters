// src/index.ts
import express from "express";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import recipeRoutes from "./routes/reciepeRoutes";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();
console.log(process.env.PORT);
console.log(process.env.MONGODBURI);

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Define Routes
app.use("/api/users", userRoutes);
// Define Routes
app.use("/api/recipes", recipeRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Recipe API");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

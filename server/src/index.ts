// @ts-nocheck
// src/index.ts
import express from "express";
import connectDB from "./config/db";
import userRoutes from "./routes/userRoutes";
import recipeRoutes from "./routes/reciepeRoutes";
import authRoutes from "./routes/authRoutes";
import dotenv from "dotenv";
import cors from "cors";

// Load environment variables from .env file
dotenv.config();

console.log(process.env.PORT);
console.log(process.env.MONGODBURI);

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());

// Enable CORS for all origins
app.use(cors());

// Define Routes
app.use("/api/refresh-token", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/recipes", recipeRoutes);

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to the Recipe API");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

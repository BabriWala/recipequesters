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

// CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5000", // Add any other origins you want to allow
  "http://localhost:3000", // You can add more here
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};

app.use(cors(corsOptions));

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

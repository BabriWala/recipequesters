const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const recipeRoutes = require("./routes/reciepeRoutes");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv");
const cors = require("cors");

// Load environment variables from .env file
dotenv.config();

console.log(process.env.PORT);
console.log(process.env.MONGODBURI);

const app = express();

// Connect Database
connectDB();

// CORS configuration
// const corsOptions = {
//   origin: "https://recipe-questers.netlify.app",
//   optionsSuccessStatus: 200,
// };

// Enable CORS with the configured options
app.use(cors());

// Custom CORS Middleware
// const setCorsHeaders = (req, res, next) => {
//   res.setHeader(
//     "Access-Control-Allow-Origin",
//     "https://recipe-questers.netlify.app"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Methods",
//     "GET, POST, OPTIONS, PUT, PATCH, DELETE"
//   );
//   res.setHeader(
//     "Access-Control-Allow-Headers",
//     "X-Requested-With, content-type"
//   );
//   res.setHeader("Access-Control-Allow-Credentials", "true");

//   if (req.method === "OPTIONS") {
//     return res.status(200).end();
//   }
//   next();
// };

// Apply CORS middleware globally
// app.use(setCorsHeaders);
// Init Middleware
app.use(express.json());

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

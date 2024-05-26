"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const reciepeRoutes_1 = __importDefault(require("./routes/reciepeRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
console.log(process.env.PORT);
console.log(process.env.MONGODBURI);
const app = (0, express_1.default)();
// Connect Database
(0, db_1.default)();
// Init Middleware
app.use(express_1.default.json());
// Define Routes
app.use("/api/users", userRoutes_1.default);
// Define Routes
app.use("/api/recipes", reciepeRoutes_1.default);
// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to the Recipe API");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-nocheck
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./config/db"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const reciepeRoutes_1 = __importDefault(require("./routes/reciepeRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
// Load environment variables from .env file
dotenv_1.default.config();
console.log(process.env.PORT);
console.log(process.env.MONGODBURI);
const app = (0, express_1.default)();
// Connect Database
(0, db_1.default)();
// CORS configuration
const corsOptions = {
    origin: "https://recipe-questers.netlify.app",
    optionsSuccessStatus: 200,
};
// Enable CORS with the configured options
app.use((0, cors_1.default)(corsOptions));
// Custom CORS Middleware
const setCorsHeaders = (req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://recipe-questers.netlify.app");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    if (req.method === "OPTIONS") {
        return res.status(200).end();
    }
    next();
};
// Apply CORS middleware globally
app.use(setCorsHeaders);
// Init Middleware
app.use(express_1.default.json());
// Define Routes
app.use("/api/refresh-token", authRoutes_1.default);
app.use("/api/users", userRoutes_1.default);
app.use("/api/recipes", reciepeRoutes_1.default);
// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to the Recipe API");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
//# sourceMappingURL=index.js.map
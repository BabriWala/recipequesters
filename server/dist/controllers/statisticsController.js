"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.statistics = void 0;
const User_1 = __importDefault(require("../models/User"));
const Reciepe_1 = __importDefault(require("../models/Reciepe"));
const statistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userCount = yield User_1.default.countDocuments();
        const usersWithPhotosCount = yield User_1.default.countDocuments({
            photoUrl: { $exists: true },
        });
        // @ts-ignore
        const totalCoins = yield User_1.default.aggregate([
            { $group: { _id: null, total: { $sum: "$coins" } } },
        ]);
        // @ts-ignore
        const totalDollars = yield User_1.default.aggregate([
            { $group: { _id: null, total: { $sum: "$dollar" } } },
        ]);
        const recipeCount = yield Reciepe_1.default.countDocuments();
        const recipesByCategory = yield Reciepe_1.default.aggregate([
            { $group: { _id: "$category", count: { $sum: 1 } } },
        ]);
        const mostWatchedRecipe = yield Reciepe_1.default.findOne().sort({
            watchedTimes: -1,
        });
        const mostViewedByUsers = yield Reciepe_1.default.aggregate([
            { $unwind: "$viewedBy" },
            { $group: { _id: "$viewedBy.userDisplayName", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 1 },
        ]);
        // @ts-ignore
        const totalWatchedTimes = yield Reciepe_1.default.aggregate([
            { $group: { _id: null, total: { $sum: "$watchedTimes" } } },
        ]);
        const mostReactedRecipe = yield Reciepe_1.default.findOne().sort({
            "reactions.count": -1,
        });
        // @ts-ignore
        const totalReactions = yield Reciepe_1.default.aggregate([
            { $group: { _id: null, total: { $sum: { $size: "$reactions" } } } },
        ]);
        // @ts-ignore
        const averageReactionsPerRecipe = 
        // @ts-ignore
        (totalReactions === null || totalReactions === void 0 ? void 0 : totalReactions.length) > 0 ? totalReactions[0].total / recipeCount : 0;
        res.json({
            userStatistics: {
                userCount,
                usersWithPhotosCount,
                // @ts-ignore
                totalCoins: totalCoins.length > 0 ? totalCoins[0].total : 0,
                // @ts-ignore
                totalDollars: totalDollars.length > 0 ? totalDollars[0].total : 0,
            },
            recipeStatistics: {
                recipeCount,
                recipesByCategory,
                mostWatchedRecipe,
                mostViewedByUsers: mostViewedByUsers.length > 0 ? mostViewedByUsers[0] : null,
                totalWatchedTimes: 
                // @ts-ignore
                (totalWatchedTimes === null || totalWatchedTimes === void 0 ? void 0 : totalWatchedTimes.length) > 0 ? totalWatchedTimes[0].total : 0,
                mostReactedRecipe,
                averageReactionsPerRecipe,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
});
exports.statistics = statistics;
//# sourceMappingURL=statisticsController.js.map
import { Schema, model, Document } from "mongoose";

export interface IReaction {
  type: string;
  count: number;
}

interface IPurchase {
  email: string;
  time: Date;
}

export interface IRecipe extends Document {
  creatorEmail: string;
  recipeName: string;
  imageUrl: string;
  details: string;
  reactions: IReaction[];
  purchases: IPurchase[];
  country: string;
  youtubeLink: string;
  category: string;
  watchedTimes: number;
  viewedBy: string[]; // Array to store user IDs who viewed the recipe
}

const reactionSchema = new Schema<IReaction>({
  type: { type: String },
  count: { type: Number, default: 0 },
});

const purchaseSchema = new Schema<IPurchase>({
  email: { type: String },
  time: { type: Date, default: Date.now },
});

const recipeSchema = new Schema<IRecipe>(
  {
    creatorEmail: { type: String, required: true },
    recipeName: { type: String, required: true },
    imageUrl: { type: String, required: true },
    details: { type: String, required: true },
    reactions: { type: [reactionSchema], default: [] },
    purchases: { type: [purchaseSchema], default: [] },
    country: { type: String, required: true },
    youtubeLink: { type: String, required: true },
    category: { type: String, required: true },
    watchedTimes: { type: Number, default: 0 },
    viewedBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // Array of user IDs who viewed the recipe
  },
  { timestamps: true }
); // Add timestamps option

const Recipe = model<IRecipe>("Recipe", recipeSchema);
export default Recipe;

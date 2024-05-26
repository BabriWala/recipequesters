// src/models/User.ts
import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  displayName: string;
  photoURL: string;
  email: string;
  coins: number;
  dollar: number;
  refreshToken: string;
}

const userSchema: Schema = new Schema({
  displayName: { type: String, required: true },
  photoURL: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  coins: { type: Number, default: 50 },
  dollar: { type: Number, default: 100 },
  refreshToken: { type: String },
});

const User = model<IUser>("User", userSchema);
export default User;

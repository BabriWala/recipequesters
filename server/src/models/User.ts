// src/models/User.ts
import { Schema, model, Document } from "mongoose";

interface IUser extends Document {
  displayName: string;
  photoUrl?: string;
  email: string;
  coins: number;
}

const userSchema = new Schema<IUser>({
  displayName: { type: String, required: true },
  photoUrl: { type: String },
  email: { type: String, required: true, unique: true },
  coins: { type: Number, default: 50 },
});

const User = model<IUser>("User", userSchema);
export default User;

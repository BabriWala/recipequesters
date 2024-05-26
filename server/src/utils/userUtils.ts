import User from "../models/User";

export const getUserDetails = async (userId: any) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

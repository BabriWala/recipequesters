import jwt from "jsonwebtoken";
export const verifyToken = (req: any) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return null;
  }
  //@ts-ignore
  return jwt.verify(token, process.env.TOKEN);
};

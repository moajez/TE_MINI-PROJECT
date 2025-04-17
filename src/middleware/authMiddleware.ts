import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import User from "../models/User";

interface AuthenticatedRequest extends Request {
  user?: any;
}

const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  
  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = await User.findById(decoded.id).select("-password");
    
    if (!req.user) {
      return res.status(401).json({ message: "User not found!" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token!" });
  }
};

export default authMiddleware;

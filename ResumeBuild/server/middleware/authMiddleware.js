import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return res.status(500).json({ message: "Server misconfigured: JWT_SECRET missing" });
      }
      const decoded = jwt.verify(token, secret);
      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized" });
      }
      return next();
    }

    return res.status(401).json({ message: "Not authorized" });

  
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Authentication failed",
    });
  }
};



import { Request, Response } from "express";
import { VerifyErrors, verify } from "jsonwebtoken";
import Config from "../config";

const secret = Config.secret || "test";

const ValidJWT = async (req: Request, res: Response, next: () => void) => {
  let token = req.headers.authorization || "";
  if (typeof token === "object") {
    return res.status(503).json({
      msg: "Not provided token",
    });
  }
  token = token.split(" ")[1] || "";
  if (token) {
    verify(token, secret, async (err: VerifyErrors | null, decoded) => {
      if (!decoded || typeof decoded !== "object") {
        console.error("Invalid JWT token");
        return res.status(403).json({ msg: "Forbidden" });
      }
      req.headers.id = decoded.id;
      next();
    });
  } else {
    res.status(401).json({
      msg: "Not provided token",
    });
  }
};

export default ValidJWT;

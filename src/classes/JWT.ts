import jwt, { Algorithm } from "jsonwebtoken";
import Error from "./Error";

export function verifyToken(token: string) {
  const bearerRegex = /^Bearer\s/;

  if (token && bearerRegex.test(token)) {
    const newToken = token.replace(bearerRegex, "");
    jwt.verify(
      newToken,
      "secretKey",
      {
        issuer: process.env.JWT_ISSUER,
      },
      (error, decoded) => {
        if (error === null && decoded) {
          return true;
        }
        return false;
      },
    );
  } else {
    return false;
  }
}

export function generateToken(payload: jwt.JwtPayload) {
  try {
    const signOpts: jwt.SignOptions = {
      issuer: process.env.JWT_ISSUER,
      algorithm: <Algorithm>process.env.JWT_ALGORITHM,
    };
    return jwt.sign(payload, <string>process.env.JWT_SECRET, signOpts);
  } catch (err) {
    throw new Error({ status: 500, message: <string>err });
  }
}

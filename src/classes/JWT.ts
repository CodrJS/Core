import jwt, { Algorithm, JwtPayload } from "jsonwebtoken";
import type { IUser } from "../models/User";
import Error from "./Error";

const isPayload = function isPayload(obj: any): obj is JwtPayload {
  return "iss" in obj;
};

export type UserToken = IUser & JwtPayload;

export function verifyToken(token: string) {
  const bearerRegex = /^Bearer\s/;

  if (token) {
    if (bearerRegex.test(token)) {
      token = token.replace(bearerRegex, "");
    }

    try {
      const decoded = jwt.verify(token, <string>process.env.JWT_SECRET, {
        issuer: process.env.JWT_ISSUER,
      });
      return decoded;
    } catch (e) {
      throw new Error({ status: 401, message: "Could not verify the JWT." });
    }
  } else {
    throw new Error({ status: 400, message: "JWT is missing." });
  }
}

/**
 * @TODO Finish writing the refresh function.
 */
export function refreshToken(token: string) {
  const bearerRegex = /^Bearer\s/;

  if (token) {
    if (bearerRegex.test(token)) {
      token = token.replace(bearerRegex, "");
    }

    try {
      const decoded = jwt.decode(token);

      if (isPayload(decoded)) {
        return decoded;
      }

      throw new Error({ status: 401, message: "Could not decode the JWT." });
    } catch (e) {
      throw new Error({ status: 401, message: "Could not decode the JWT." });
    }
  } else {
    throw new Error({ status: 400, message: "JWT is missing." });
  }
}

export function generateToken(payload: IUser) {
  try {
    const signOpts: jwt.SignOptions = {
      issuer: process.env.JWT_ISSUER,
      algorithm: <Algorithm>process.env.JWT_ALGORITHM,
      subject: payload._id,
    };
    return jwt.sign(payload, <string>process.env.JWT_SECRET, signOpts);
  } catch (err) {
    throw new Error({ status: 500, message: <string>err });
  }
}

import { v4, validate } from "uuid";
import crypto from "crypto";
import type { IAccessToken } from "../classes/AccessToken.js";

const md5 = (text: string) => {
  return crypto.createHash("md5").update(text).digest();
};

export function isAccessToken(obj: any): obj is IAccessToken {
  if (obj instanceof Object) {
    return "uuid" in obj;
  } else {
    return false;
  }
}

export function isUuid(text: any): text is typeof v4 {
  return validate(text);
}

// for encrypting AccessCode object into a string
export function encrypt(text: string) {
  let secretKey = md5(process.env.SECRET as string);
  secretKey = Buffer.concat([secretKey, secretKey.subarray(0, 8)]);
  const cipher = crypto.createCipheriv("des-ede3", secretKey, "");
  const encrypted = cipher.update(text, "utf8", "hex");
  return encrypted + cipher.final("hex");
}

// for decrypting AccessCode string into an object
export function decrypt<T>(text: string) {
  let secretKey = md5(process.env.SECRET as string);
  secretKey = Buffer.concat([secretKey, secretKey.subarray(0, 8)]);
  const decipher = crypto.createDecipheriv("des-ede3", secretKey, "");
  let decrypted = decipher.update(text, "hex");
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  decrypted += decipher.final();
  return JSON.parse(decrypted as unknown as string) as T;
}

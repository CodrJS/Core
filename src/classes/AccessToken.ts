import { v4, validate } from "uuid";
import crypto from "crypto";
import Error from "./Error";

const md5 = (text: string) => {
  return crypto.createHash("md5").update(text).digest();
};

interface IAccessToken {
  uuid: typeof v4;
  createdAt: string;
  expired: boolean;
}

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

class AccessToken {
  private uuid: typeof v4;
  private createdAt: string;
  private expired: boolean;

  public constructor(uuid: typeof v4);
  public constructor(encoded: string);
  public constructor(token: IAccessToken);
  public constructor(arg: typeof v4 | string | IAccessToken) {
    if (arg) {
      if (isUuid(arg)) {
        this.uuid = arg;
        this.createdAt = new Date().toISOString();
        this.expired = false;
      } else if (typeof arg === "string") {
        try {
          const code = decrypt<AccessToken>(<string>arg);
          this.uuid = code.uuid;
          this.createdAt = code.createdAt;
          this.expired = code.expired;
        } catch (e: any) {
          throw new Error({ status: 500, message: e?.message });
        }
      } else if (isAccessToken(arg)) {
        this.uuid = arg.uuid;
        this.createdAt = arg.createdAt;
        this.expired = arg.expired;
      } else {
        throw new Error({
          status: 500,
          message: "Invalid argument given in AccessToken",
        });
      }
    } else {
      throw new Error({
        status: 500,
        message: "AccessToken requires an argument in the constructor",
      });
    }
  }

  use() {
    this.expired = true;
  }

  toJSON() {
    return {
      uuid: this.uuid,
      createdAt: this.createdAt,
      expired: this.expired,
    };
  }

  encode() {
    return encrypt(JSON.stringify(this.toJSON()));
  }
}

export default AccessToken;

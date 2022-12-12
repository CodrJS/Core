import { v4 } from "uuid";
import Error from "./Error.js";
import {
  decrypt,
  encrypt,
  isAccessToken,
  isUuid,
} from "../utils/AccessToken.js";

export interface IAccessToken {
  uuid: typeof v4;
  createdAt: string;
  expired: boolean;
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

  isValid(uuid: typeof v4) {
    return (
      // uuids match
      this.uuid == uuid &&
      // token was created less than 5 minutes ago
      new Date().getTime() <
        new Date(this.createdAt).getTime() + 5 * 60 * 1000 &&
      // and this token has not expired.
      !this.expired
    );
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

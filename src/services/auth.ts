/**
 * This service handles all authentication handlers for codr.
 */

import { v4 as uuidv4 } from "uuid";
import App from "./app";
import Mail from "./mail";
import Email from "../classes/Email";
import SigninTemplate from "../classes/Mail/Template/Signin";
import User from "../models/User";
import Response from "classes/Response";
import { generateToken } from "classes/JWT";
import Error from "../classes/Error";
import crypto from "crypto";

const md5 = (text: string) => {
  return crypto.createHash("md5").update(text).digest();
};

interface IAccessCode {
  email: string;
  token: string;
}

class Authentication {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  // get currentUser(): typeof User {

  // }

  // for encrypting AccessCode object into a string
  private encrypt(text: string) {
    let secretKey = md5(process.env.SECRET as string);
    secretKey = Buffer.concat([secretKey, secretKey.subarray(0, 8)]);
    const cipher = crypto.createCipheriv("des-ede3", secretKey, "");
    const encrypted = cipher.update(text, "utf8", "hex");
    return encrypted + cipher.final("hex");
  }

  // for decrypting AccessCode string into an object
  private decrypt(text: string) {
    let secretKey = md5(process.env.SECRET as string);
    secretKey = Buffer.concat([secretKey, secretKey.subarray(0, 8)]);
    const decipher = crypto.createDecipheriv("des-ede3", secretKey, "");
    let decrypted = decipher.update(text, "utf8", "hex");
    decrypted += decipher.final();
    return decrypted;
  }

  async signinWithEmail(
    accessCode: string,
  ): Promise<Response<undefined | { token: string }>> {
    const { email, token: accessToken } = JSON.parse(
      this.decrypt(accessCode),
    ) as IAccessCode;
    if (!email)
      throw new Error({
        status: 400,
        message: "No email address was received",
      });
    if (!new Email(email).isValid)
      throw new Error({
        status: 400,
        message: "Invalid email address provided",
      });

    try {
      const user = await User.findOne({ email });
      if (!user) {
        // is user cannot be found, then they are not allowed in.
        throw new Error({
          status: 401,
          message:
            "It appears you do not have an account using this email, please contact the organization admin to gain access.",
        });
      } else if (!accessToken) {
        try {
          // init access token
          const accessToken = uuidv4();
          await user.update({
            accessToken: this.encrypt(
              JSON.stringify({
                value: accessToken,
                createdAt: new Date().toISOString(),
                exprired: false,
              }),
            ),
          });

          // send email with magic link
          const link =
            process.env["DOMAIN"] +
            "/auth/email/verify?token=" +
            this.encrypt(JSON.stringify({ email: email, token: accessToken }));
          const template = new SigninTemplate();
          await Mail.send(await template.html({ link }), {
            ...template.config,
            to: email,
          });
          return new Response({
            message: "An email has been sent to your inbox.",
          });
        } catch (e: any) {
          throw new Error({
            status: 500,
            message: e?.message || "An unknown error occured",
          });
        }
      } else if (user.accessToken) {
        const accessCode = JSON.parse(this.decrypt(user.accessToken)) as {
          value: string;
          createdAt: string;
          expired: boolean;
        };
        if (
          accessCode?.value == accessToken &&
          new Date().getTime() <
            new Date(accessCode?.createdAt).getTime() + 5 * 60 * 1000
        ) {
          // generate JWT token
          const token = generateToken(user.toJSON());

          // update user
          await user.updateOne({
            accessToken: this.encrypt(
              JSON.stringify({ ...accessCode, expired: true }),
            ),
            refreshToken: this.encrypt(
              JSON.stringify({
                value: uuidv4(),
                createdAt: new Date().toISOString(),
                expired: false,
              }),
            ),
          });
          return new Response<{ token: string }>({
            message: `Login successful.`,
            details: { token },
          });
        } else
          throw new Error({
            status: 500,
            message: "Login link expired or is invalid.",
          });
      } else
        throw new Error({
          status: 500,
          message: "Login link expired or is invalid.",
        });
    } catch (e: any) {
      throw new Error({
        status: 500,
        message: e?.message || "An unknown error occured",
      });
    }
  }
}

export default Authentication;

/**
 * This service handles all authentication handlers for codr.
 */

import { v4 as uuidv4 } from "uuid";
import App from "./app.js";
import Mail from "./mail/index.js";
import Email from "../classes/Email.js";
import SigninTemplate from "../classes/MailTemplate/Signin.js";
import User, { IUser } from "../models/User.js";
import Response from "../classes/Response.js";
import * as JWT from "../classes/JWT.js";
import Error from "../classes/Error.js";
import AccessToken from "../classes/AccessToken.js";
import { decrypt, encrypt } from "../utils/AccessToken";
import { decode } from "jsonwebtoken";

interface IAccessCode {
  email: string;
  token: typeof uuidv4;
}

class Authentication {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  // get currentUser(): typeof User {

  // }

  async signinWithEmail(
    accessCode: string,
  ): Promise<Response<undefined | { user: IUser }>> {
    const { email, token } = decrypt<IAccessCode>(accessCode);
    if (!email) {
      throw new Error({
        status: 400,
        message: "No email address was received",
      });
    } else if (!new Email(email).isValid) {
      throw new Error({
        status: 400,
        message: "Invalid email address provided",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // is user cannot be found, then they are not allowed in.
      throw new Error({
        status: 401,
        message:
          "It appears you do not have an account using this email, please contact your Codr admin to gain access.",
      });
    } else if (!token) {
      if (user.flags.isDisabled) {
        throw new Error({
          status: 500,
          message:
            "It appears that your account has been disabled or deleted. Please contact your administrator if you feel like this is a mistake.",
        });
      } else {
        try {
          // init access token
          const uuid = uuidv4();
          const accessToken = new AccessToken(uuid);
          await user.updateOne({
            accessToken: accessToken.encode(),
          });

          // send email with access code/token
          const link =
            `${process.env.HOST}${process.env.API_PATH}` +
            "/auth/email/verify?token=" +
            encrypt(JSON.stringify({ email: email, token: uuid }));
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
            details: e,
          });
        }
      }
    } else if (user.accessToken) {
      // decrypt the stored access code
      const accessToken = new AccessToken(user.accessToken);

      // check if:
      // * the tokens match
      // * the token was created less than 5 minutes ago
      // * and the token is not expired (has not been used already)
      if (accessToken.isValid(token)) {
        // update access token
        accessToken.use();

        // init user update
        const update = {
          accessToken: accessToken.encode(),
          refreshToken: new AccessToken(uuidv4()).encode(),
        };

        try {
          // update user
          await user.updateOne(update);
        } catch (e: any) {
          throw new Error({
            status: 500,
            message: "An unexpected error occured while updating a user.",
            details: e,
          });
        }

        try {
          // send response
          return new Response<{ user: IUser }>({
            message: `Login successful.`,
            details: { user: { ...user.toObject(), ...update } },
          });
        } catch (e: any) {
          throw new Error({
            status: 500,
            message:
              "An unexpected error occured while generating a JSON web token.",
            details: e?.details,
          });
        }
      } else {
        throw new Error({
          status: 500,
          message: "Login link expired or is invalid.",
        });
      }
    } else {
      throw new Error({
        status: 500,
        message:
          "An unknown error occured while authenticating an access token.",
      });
    }
  }

  updateJWT(oldJWT: string, payload: IUser) {
    JWT.verifyToken(oldJWT);

    const jwt = JWT.generateToken(payload);
    return { jwt, user: decode(jwt) as JWT.UserToken };
  }
}

export default Authentication;

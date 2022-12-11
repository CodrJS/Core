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
import AccessToken, { decrypt, encrypt } from "classes/AccessToken";

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
  ): Promise<Response<undefined | { token: string }>> {
    const { email, token: accessToken } = decrypt<IAccessCode>(accessCode);
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
            "It appears you do not have an account using this email, please contact your Codr admin to gain access.",
        });
      } else if (!accessToken) {
        try {
          // init access token
          const uuid = uuidv4();
          const accessToken = new AccessToken(uuid);
          await user.update({
            accessToken: accessToken.encode(),
          });

          // send email with access code/token
          const link =
            process.env["API_URL"] +
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
          });
        }
      } else if (user.accessToken) {
        // decrypt the stored access code
        const accessCode = new AccessToken(user.accessToken);

        // check if:
        // * the tokens match
        // * the token was created less than 5 minutes ago
        // * and the token is not expired (has not been used already)
        if (
          accessCode.toJSON().uuid == accessToken &&
          new Date().getTime() <
            new Date(accessCode.toJSON().createdAt).getTime() + 5 * 60 * 1000 &&
          !accessCode.toJSON().expired
        ) {
          // generate JWT token
          const data = { ...user.toJSON(), _id: user._id.toString() };
          const token = generateToken(data);

          accessCode.use();

          // update user
          await user.updateOne({
            accessToken: accessCode.encode(),
            refreshToken: new AccessToken(uuidv4()).encode(),
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

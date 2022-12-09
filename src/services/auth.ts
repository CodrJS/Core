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

class Authentication {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  // get currentUser(): typeof User {

  // }

  async signinWithEmail({
    email,
    accessToken,
  }: {
    email: Email;
    accessToken?: string;
  }): Promise<Response<undefined | { token: string }>> {
    if (!email)
      throw new Error({
        status: 400,
        message: "No email address was received",
      });
    if (!email.isValid)
      throw new Error({
        status: 400,
        message: "Invalid email address provided",
      });

    try {
      const user = await User.findOne({ email: email.email });
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
          await User.findOneAndUpdate(
            { email: email.email },
            {
              accessToken: {
                value: accessToken,
                createdAt: new Date().toISOString(),
                used: false,
              },
            },
          );

          // send email with magic link
          const link =
            process.env["DOMAIN"] +
            "/auth/email/verify?email=" +
            email.email +
            "&token=" +
            accessToken;
          const template = new SigninTemplate();
          await Mail.send(await template.html({ link }), {
            ...template.config,
            to: email.email,
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
      } else if (
        user.accessToken?.value == accessToken &&
        new Date().getTime() <
          new Date(user.accessToken?.createdAt).getTime() + 5 * 60 * 1000
      ) {
        const token = generateToken(user.toJSON());
        await User.findOneAndUpdate(
          { email: email.email },
          { "accessToken.used": true },
        );
        return new Response<{ token: string }>({
          message: `Welcome, ${user.name}`,
          details: { token },
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

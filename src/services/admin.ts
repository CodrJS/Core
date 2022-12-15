/**
 * This service handles all administrative tasks for codr.
 */

import { MailTemplate, Response, Error } from "../classes/index.js";
import { Types } from "mongoose";
import { UserToken } from "../classes/JWT.js";
import User, { IUser, IUserName, UserRoleType } from "../models/User.js";
import App from "./app.js";
import Mail from "./mail/index.js";

class Administration {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  private isAdmin(user: UserToken) {
    const isAdmin = user.role === "codr:admin";
    if (!isAdmin) {
      throw new Error({ status: 403, message: "User is unauthorized." });
    }
  }

  async addUser(
    user: UserToken,
    newUser: { email: string; role: UserRoleType; name?: IUserName },
  ) {
    if (this.app.mongoIsConnected) {
      // check if user is admin; will throw an error if not.
      this.isAdmin(user);

      if (newUser.email && newUser.role) {
        // create and returns a new user is no error occurs.
        const nUser = await User.create(newUser);

        const tempOpts = {
          role: newUser.role,
          link: process.env.HOST + "/signin",
          name: newUser.name
            ? newUser.name.preferred
              ? newUser.name.preferred
              : newUser.name.first
            : undefined,
        };
        const template = newUser.name
          ? new MailTemplate.Welcome.Memeber()
          : new MailTemplate.Welcome.Anonymous();
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        Mail.send(await template.html(tempOpts), {
          ...template.config,
          to: newUser.email,
        });

        return new Response({
          message: "User created successfully",
          details: nUser,
        });
      } else {
        throw new Error({
          status: 400,
          message: "Please ensure the new user has an email and role assigned.",
          details: newUser,
        });
      }
    } else {
      throw new Error({
        status: 500,
        message: "MongoDB is not connected.",
        details: {
          connectionStatus: this.app.mongoStatus,
        },
      });
    }
  }

  /**
   * Bulk add users to the database.
   * @param user Authenticated user token
   * @param newUsers An array of new users to add to the organization
   * @returns all added users and an array of errors if any failed to create
   */
  async addUsers(
    user: UserToken,
    newUsers: { email: string; role: UserRoleType }[],
  ) {
    const users: (IUser & { _id: Types.ObjectId })[] = [];
    const errors: Error<
      { email: string; role: UserRoleType } | { connectionStatus: string }
    >[] = [];
    for (const u of newUsers) {
      try {
        const nUser = await this.addUser(user, u);
        users.push(nUser.details);
      } catch (e: any) {
        errors.push(e);
      }
    }

    return new Response({
      message: errors.length
        ? "Some errors occurred while adding users."
        : "All users have been added.",
      details: { users, errors },
    });
  }
}

export default Administration;

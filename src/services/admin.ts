/**
 * This service handles all administrative tasks for codr.
 */

import { ObjectId } from "mongoose";
import { MailTemplate, Response, Error } from "../classes/index.js";
import { UserToken } from "../classes/JWT.js";
import { IUser, USERROLE, UserRoleType } from "../models/User.js";
import App from "./app.js";
import Database from "./database.js";
import Mail from "./mail/index.js";

class Administration {
  private app: App;
  private database: Database;
  constructor(app: App) {
    this.app = app;
    this.database = new Database(app);
  }

  private isAdmin(user: UserToken) {
    const isAdmin = user.role === "codr:admin";
    if (!isAdmin) {
      throw new Error({ status: 403, message: "User is unauthorized." });
    }
  }

  async addUser(
    user: UserToken,
    newUser: {
      email: string;
      role: UserRoleType;
      name?: IUser["name"];
      flags?: IUser["flags"];
      username?: string;
    },
  ) {
    if (this.app.mongoIsConnected) {
      // check if user is admin; will throw an error if not.
      this.isAdmin(user);
      const [User] = this.database.User(user);
      const [Profile] = this.database.Profile(user);

      if (newUser.email && newUser.role) {
        let username: string | undefined;
        if (newUser.username) {
          username = `${newUser.username}`;
          delete newUser.username;
        }

        // create and returns a new user is no error occurs.
        const nUser = await User.create(newUser);

        if (username) {
          Profile.create({ user: nUser._id, username });
        }

        const tempOpts = {
          role: USERROLE[newUser.role],
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
    newUsers: {
      email: string;
      role: UserRoleType;
      name?: IUser["name"];
      flags?: IUser["flags"];
    }[],
  ) {
    const users: IUser[] = [];
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

  async getUsers(user: IUser) {
    this.isAdmin(user);
    const User = this.database.withAbility(this.database.User(user));

    const users = (await User.find()).map(u => u.toObject());

    return new Response({
      message: "OK",
      details: { users },
    });
  }

  async updateUser(user: IUser, update: Partial<IUser> & { _id: ObjectId }) {
    this.isAdmin(user);
    const User = this.database.withAbility(this.database.User(user));

    if (this.app.mongoIsConnected) {
      try {
        const uUser = await User.findByIdAndUpdate(update._id, update);

        if (uUser)
          return new Response({
            message: "User updated successfully",
            details: uUser,
          });
        else {
          throw new Error({
            status: 500,
            message: "An error occurred while trying to update a user.",
            details: update,
          });
        }
      } catch (e) {
        throw new Error({
          status: 500,
          message: "An error occurred while trying to update a user.",
          details: e,
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

  async updateUsers(
    user: IUser,
    updates: (Partial<IUser> & { _id: ObjectId })[],
  ) {
    this.isAdmin(user);

    const users: IUser[] = [];
    const errors: Error<
      (Partial<IUser> & { _id: ObjectId }) | { connectionStatus: string }
    >[] = [];

    for (const update of updates) {
      try {
        const u = await this.updateUser(user, update);
        users.push(u.details);
      } catch (e: any) {
        errors.push(e);
      }
    }

    return new Response({
      message: errors.length
        ? "Some errors occurred while updating users."
        : "All users have been updated.",
      details: { users, errors },
    });
  }
}

export default Administration;

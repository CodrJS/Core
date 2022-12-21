/**
 * This service handles all configuration handlers for codr.
 */

import Profile, { IProfile } from "../models/Profile.js";
import ProfileAbility from "../models/Profile.ability.js";
import User, { IUser } from "../models/User.js";
import UserAbility from "../models/User.ability.js";
import App from "./app.js";
import { QueryWithHelpers } from "mongoose";
import type { AccessibleRecordQueryHelpers } from "@casl/mongoose/dist/types/accessible_records.js";
import Error from "../classes/Error.js";

class Database {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  User(
    token: IUser,
  ): QueryWithHelpers<
    IUser[],
    IUser,
    AccessibleRecordQueryHelpers<IUser>,
    IUser
  > {
    if (this.app.mongoIsConnected) {
      const query = User.accessibleBy(UserAbility(token));
      return query;
    } else {
      throw new Error({ status: 500, message: "MongoDB is not connected." });
    }
  }

  Profile(
    token: IUser,
  ): QueryWithHelpers<
    IProfile[],
    IProfile,
    AccessibleRecordQueryHelpers<IProfile>,
    IProfile
  > {
    if (this.app.mongoIsConnected)
      return Profile.accessibleBy(ProfileAbility(token));
    else {
      throw new Error({ status: 500, message: "MongoDB is not connected." });
    }
  }
}

export default Database;

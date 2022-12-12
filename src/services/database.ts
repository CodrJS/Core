/**
 * This service handles all configuration handlers for codr.
 */

import { UserToken } from "../classes/JWT.js";
import Profile, { IProfile } from "../models/Profile.js";
import ProfileAbility from "../models/Profile.ability.js";
import User, { IUser } from "../models/User.js";
import UserAbility from "../models/User.ability.js";
import App from "./app.js";
import { QueryWithHelpers, Types } from "mongoose";
import type { AccessibleRecordQueryHelpers } from "../../node_modules/@casl/mongoose/dist/types/accessible_records.js";

class Database {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  User(
    token: UserToken,
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
      throw Error("MongoDB is not connected");
    }
  }

  Profile(token: UserToken): QueryWithHelpers<
    (IProfile & {
      _id: Types.ObjectId;
    })[],
    IProfile & {
      _id: Types.ObjectId;
    },
    AccessibleRecordQueryHelpers<IProfile>,
    IProfile & {
      _id: Types.ObjectId;
    }
  > {
    if (this.app.mongoIsConnected)
      return Profile.accessibleBy(ProfileAbility(token));
    else throw Error("MongoDB is not connected");
  }
}

export default Database;

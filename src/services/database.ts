/**
 * This service handles all configuration handlers for codr.
 */

import Profile from "../models/Profile.js";
import ProfileAbility from "../models/Profile.ability.js";
import User, { IUser } from "../models/User.js";
import UserAbility from "../models/User.ability.js";
import App from "./app.js";
import Error from "../classes/Error.js";

class Database {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  User(token: IUser) {
    if (this.app.mongoIsConnected) {
      const query = User.accessibleBy(UserAbility(token));
      return query;
    } else {
      throw new Error({ status: 500, message: "MongoDB is not connected." });
    }
  }

  Profile(token: IUser) {
    if (this.app.mongoIsConnected)
      return Profile.accessibleBy(ProfileAbility(token));
    else {
      throw new Error({ status: 500, message: "MongoDB is not connected." });
    }
  }
}

export default Database;

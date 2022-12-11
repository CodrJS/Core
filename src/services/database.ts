/**
 * This service handles all configuration handlers for codr.
 */

import { UserToken } from "classes/JWT";
import Profile from "../models/Profile";
import ProfileAbility from "../models/Profile.ability";
import User from "../models/User";
import UserAbility from "../models/User.ability";
import App from "./app";

class Database {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  User(token: UserToken) {
    if (this.app.mongoIsConnected) return User.accessibleBy(UserAbility(token));
    else throw Error("MongoDB is not connected");
  }

  Profile(token: UserToken) {
    if (this.app.mongoIsConnected)
      return Profile.accessibleBy(ProfileAbility(token));
    else throw Error("MongoDB is not connected");
  }
}

export default Database;

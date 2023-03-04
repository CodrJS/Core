/**
 * This service handles all configuration handlers for codr.
 */

import App from "./app.js";
import { Ability as AppAbility, ACTION } from "../types/Ability.js";
import { Ability, Model } from "../models/index.js";
import { IUser, UserDocument } from "../models/User.js";
import { ProfileDocument } from "../models/Profile.js";
import { ProjectDocument } from "../models/Project/index.js";
import { UserGroupDocument } from "../models/UserGroup.js";
import { AccessibleModel } from "@casl/mongoose";

class Database {
  private app: App;
  constructor(app: App) {
    this.app = app;
  }

  withAbility<M extends AccessibleModel<A>, A>(
    [model, ability]: [M, AppAbility<A>],
    action?: ACTION,
  ) {
    return model.accessibleBy(ability, action);
  }

  /**
   * Manage profile database schema
   */
  Profile(token: IUser): [typeof Model.Profile, AppAbility<ProfileDocument>] {
    return [Model.Profile, Ability.ProfileAbility(token)];
  }

  /**
   * Manage project database schema
   */
  Project(token: IUser): [typeof Model.Project, AppAbility<ProjectDocument>] {
    return [Model.Project, Ability.ProjectAbility(token)];
  }

  /**
   * Manage user database schema
   */
  User(token: IUser): [typeof Model.User, AppAbility<UserDocument>] {
    return [Model.User, Ability.UserAbility(token)];
  }

  /**
   * Manage user group database schema
   */
  UserGroup(
    token: IUser,
  ): [typeof Model.UserGroup, AppAbility<UserGroupDocument>] {
    return [Model.UserGroup, Ability.UserGroupAbility(token)];
  }
}

export default Database;

import { DefineAbility, Permissions } from "../types/Ability.js";
import { IUser } from "./User.js";
import { UserGroupDocument } from "./UserGroup.js";

const permissions: Permissions<UserGroupDocument> = {
  "codr:admin": (user, { can }) => {
    can("manage", "UserGroup");
  },
  "codr:researcher": (user, { can }) => {
    can("read", "UserGroup");
    can("create", "UserGroup");
    can("update", "UserGroup", { creator: user._id });
    can("delete", "UserGroup", { creator: user._id });
  },
  "codr:annotator": (user, { can }) => {
    can("read", "UserGroup", { members: user._id });
  },
};

const UserGroupAbility = (user: IUser) => DefineAbility(user, permissions);
export default UserGroupAbility;

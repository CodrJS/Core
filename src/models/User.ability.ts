import { DefineAbility, Permissions } from "../types/Ability.js";
import { IUser, UserDocument } from "./User.js";

const permissions: Permissions<UserDocument> = {
  "codr:admin": (user, { can }) => {
    can("manage", "User");
  },
  "codr:researcher": (user, { can }) => {
    can("read", "User", { _id: user._id });
    can("update", "User", { _id: user._id });
  },
  "codr:annotator": (user, { can }) => {
    can("read", "User", { _id: user._id });
    can("update", "User", { _id: user._id });
  },
};

const UserAbility = (user: IUser) => DefineAbility(user, permissions);
export default UserAbility;

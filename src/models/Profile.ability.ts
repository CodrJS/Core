import { DefineAbility, Permissions } from "../types/Ability.js";
import { IUser } from "./User.js";
import { ProfileDocument } from "./Profile.js";

const permissions: Permissions<ProfileDocument> = {
  "codr:admin": (user, { can }) => {
    can("manage", "Profile");
  },
  "codr:researcher": (user, { can }) => {
    can("read", "Profile");
    can("create", "Profile", { user: user._id });
    can("update", "Profile", { user: user._id });
  },
  "codr:annotator": (user, { can }) => {
    can("read", "Profile");
  },
};

const ProfileAbility = (user: IUser) => DefineAbility(user, permissions);
export default ProfileAbility;

import { defineAbility } from "@casl/ability";
import { IUser } from "./User.js";

export default function ProfileAbility(user: IUser) {
  return defineAbility(can => {
    if (user.role === "codr:admin") {
      can("manage", "Profile");
    } else {
      can("create", "Profile", { user: user._id });
      can("read", "Profile", { user: user._id });
      can("update", "Profile", { user: user._id });
    }
  });
}

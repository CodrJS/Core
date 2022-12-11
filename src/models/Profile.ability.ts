import { defineAbility } from "@casl/ability";
import { IUser } from "./User";

export default function ProfileAbility(user: IUser) {
  return defineAbility(can => {
    if (user.isAdmin) {
      can("manage", "Profile");
    } else {
      can("create", "Profile", { userId: user._id });
      can("read", "Profile", { userId: user._id });
      can("update", "Profile", { userId: user._id });
    }
  });
}

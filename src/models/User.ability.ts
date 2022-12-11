import { defineAbility } from "@casl/ability";
import { IUser } from "./User";

export default function UserAbility(user: IUser) {
  return defineAbility(can => {
    if (user.isAdmin) {
      can("manage", "User");
    } else {
      can("read", "User", { _id: user._id });
      can("update", "User", { _id: user._id });
    }
  });
}

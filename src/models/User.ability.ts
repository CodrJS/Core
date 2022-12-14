import { defineAbility } from "@casl/ability";
import { IUser } from "./User.js";

export default function UserAbility(user: IUser) {
  return defineAbility((can) => {
    if (user.role === "codr:admin") {
      can("manage", "User");
    } else {
      can("read", "User", { _id: user._id });
      can("update", "User", { _id: user._id });
    }
  });
}

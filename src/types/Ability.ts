import {
  AbilityBuilder,
  AbilityClass,
  createAliasResolver,
  ForcedSubject,
  MongoQuery,
  PureAbility,
} from "@casl/ability";
import { ProfileDocument } from "../models/Profile";
import { ProjectDocument } from "../models/Project";
import { IUser, UserDocument, UserRoleType } from "../models/User";
import { UserGroupDocument } from "../models/UserGroup";

// setup action and subject types for ability
export type ACTION = "read" | "create" | "update" | "delete" | "manage";
export type SUBJECT =
  | "User"
  | UserDocument
  | "Profile"
  | ProfileDocument
  | "UserGroup"
  | UserGroupDocument
  | "Project"
  | ProjectDocument
  | "all";
export type ABILITIES = [
  ACTION,
  SUBJECT | ForcedSubject<Exclude<SUBJECT, "all">>,
];

// define what an ability is using the action and subject types
export type Ability<T> = PureAbility<ABILITIES, MongoQuery<T>>;

// define permissions; used to create an ability
export type DefinePermissions<T> = (
  user: IUser,
  builder: AbilityBuilder<Ability<T>>,
) => void;
export type Permissions<T> = Record<UserRoleType, DefinePermissions<T>>;

// export a function for defining an ability using generics.
export const DefineAbility = function DefineAbility<T>(
  user: IUser,
  permissions: Record<UserRoleType, DefinePermissions<T>>,
) {
  const builder = new AbilityBuilder(PureAbility as AbilityClass<Ability<T>>);

  if (typeof permissions[user.role] === "function") {
    permissions[user.role](user, builder);
  } else {
    throw new Error(
      `Trying to use unsupported role "${user.role}" in ability.`,
    );
  }

  return builder.build({ resolveAction });
};

// use this resolver in all abilities to define
const resolveAction = createAliasResolver({
  // manage: ["update", "delete", "read", "create"],
});

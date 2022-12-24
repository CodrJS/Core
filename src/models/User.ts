import { EmailRegex } from "../classes/Email.js";
import {
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { Schema, model, Document, ObjectId } from "mongoose";

type Role = "admin" | "researcher" | "annotator";
export type UserRoleType = `codr:${Role}`;
export enum USERROLE {
  "codr:admin" = "Admin",
  "codr:researcher" = "Researcher",
  "codr:annotator" = "Annotator",
}

interface User {
  name?: {
    first: string;
    last: string;
    preferred?: string;
  };
  email: string;
  accessToken: string;
  refreshToken: string;
  role: UserRoleType;
  flags: {
    isDisabled: boolean;
    isAnonymous: boolean;
  };
  createdAt: string;
  updatedAt: string;
}

export type IUserSchema = User & Document;
export type IUser = User & {
  _id: ObjectId;
};

const UserSchema = new Schema<User>(
  {
    name: {
      type: Object,
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Email cannot be blank."],
      match: [
        // eslint-disable-next-line no-control-regex
        EmailRegex,
        "is invalid.",
      ],
      unique: true,
      index: true,
    },
    accessToken: { type: String },
    refreshToken: { type: String },
    role: {
      type: String,
      required: [true, "Please specify the user's role."],
    },
    flags: {
      type: Object,
      required: true,
      default: { isAnonymous: false, isDisabled: false },
    },
  },
  {
    timestamps: true,
  },
);

// exports User model.
UserSchema.plugin(accessibleFieldsPlugin);
UserSchema.plugin(accessibleRecordsPlugin);
const User = model<IUserSchema, AccessibleModel<IUserSchema>>(
  "User",
  UserSchema,
);
export default User;

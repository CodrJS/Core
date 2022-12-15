import { EmailRegex } from "../classes/Email.js";
import {
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { Schema, model, Document } from "mongoose";

type Role = "admin" | "researcher" | "annotator";
export type UserRoleType = `codr:${Role}`;

interface IUserProvider {
  photo?: string;
  phone?: string;
  email: string;
  uid: string;
}

export interface IUserName {
  first: string;
  last: string;
  preferred: string;
}

export interface IUser extends Document {
  name?: IUserName;
  email: string;
  accessToken: string;
  refreshToken: string;
  providers?: IUserProvider;
  isAdmin: boolean;
  role: UserRoleType;
}

const UserProvider = new Schema<IUserProvider>({
  photo: { type: String },
  phone: { type: String },
  email: { type: String, required: true },
  uid: {
    type: String,
    required: [true, "Provider's unique identifier is required"],
  },
});

const UserName = new Schema<IUserName>({
  first: { type: String },
  last: { type: String },
  preferred: { type: String },
});

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: UserName,
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
    providers: {
      type: [UserProvider],
    },
    role: {
      type: String,
      required: [true, "Please specify the user's role."],
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.virtual("fullName").get(function get() {
  return this.name?.preferred + " " + this.name?.last;
});

// exports User model.
UserSchema.plugin(accessibleFieldsPlugin);
UserSchema.plugin(accessibleRecordsPlugin);
const User = model<IUser, AccessibleModel<IUser>>("User", UserSchema);
export default User;

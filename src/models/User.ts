import { EmailRegex } from "../classes/Email";
import { Schema, model, Document } from "mongoose";
import { AccessibleRecordModel } from "@casl/mongoose";

interface IUserProvider {
  photo?: string;
  phone?: string;
  email: string;
  uid: string;
}

interface IUserName {
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
  preferred: { type: String, required: true },
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
    isAdmin: {
      type: Boolean,
      default: false,
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
const User = model<IUser, AccessibleRecordModel<IUser>>("User", UserSchema);
export default User;

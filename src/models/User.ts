import { EmailRegex } from "../classes/Email";
import { Schema, model } from "mongoose";

interface IUserProvider {
  photo?: string;
  phone?: string;
  email: string;
  uid: string;
}

export interface IUser {
  name?: string;
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
  uid: { type: String, required: [true, "Provider's user id is required"] },
});

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      match: [
        // Must match: "lastName,firstName<preferredName>"
        /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/g,
        "is invalid.",
      ],
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
    methods: {
      // generateJWT: {
      //   get() {
      //     const today = new Date();
      //     const exp = new Date(today);
      //     exp.setDate(today.getDate() + 7); // set expiration 7 days out.
      //     return sign(
      //       {
      //         id: this._id,
      //         displayName: this.virtuals.preferredName,
      //         exp: exp.getTime() / 1000,
      //       },
      //       process.env.SECRET as string,
      //     );
      //   },
      // },
    },
  },
);

UserSchema.virtual("firstName").get(function get() {
  const displayNameRegex =
    /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/gm;
  const result = displayNameRegex.exec(<string>this.name);

  // set name data
  if (result?.groups) {
    const { firstName } = result.groups;
    return firstName;
  }
});

UserSchema.virtual("lastName").get(function get() {
  const displayNameRegex =
    /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/gm;
  const result = displayNameRegex.exec(<string>this.name);

  // set name data
  if (result?.groups) {
    const { lastName } = result.groups;
    return lastName;
  }
});

UserSchema.virtual("perferredName").get(function get() {
  const displayNameRegex =
    /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/gm;
  const result = displayNameRegex.exec(<string>this.name);

  // set name data
  if (result?.groups) {
    const { preferredName } = result.groups;
    return preferredName;
  }
});

UserSchema.virtual("fullName").get(function get() {
  const displayNameRegex =
    /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/gm;
  const result = displayNameRegex.exec(<string>this.name);

  // set name data
  if (result?.groups) {
    const { firstName, lastName } = result.groups;
    return firstName + " " + lastName;
  }
});

// exports User model.
const User = model<IUser>("User", UserSchema);
export default User;

import { Schema, models, model } from "mongoose";
// import { sign } from "jsonwebtoken";

const UserProvider = new Schema({
  photo: { type: String },
  phone: { type: String },
  email: { type: String },
  uid: { type: String, required: [true, ""] },
});

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, ""],
    },
    email: {
      type: String,
      lowercase: true,
      required: [true, "Email cannot be blank."],
      match: [
        // eslint-disable-next-line no-control-regex
        /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/g,
        "is invalid.",
      ],
      index: true,
    },
    providers: {
      type: [UserProvider],
    },
  },
  {
    timestamps: true,
    virtuals: {
      firstName: {
        get() {
          const displayNameRegex =
            /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/gm;
          const result = displayNameRegex.exec(<string>this.name);

          // set name data
          if (result?.groups) {
            const { firstName } = result.groups;
            return firstName;
          }
        },
      },
      lastName: {
        get() {
          const displayNameRegex =
            /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/gm;
          const result = displayNameRegex.exec(<string>this.name);

          // set name data
          if (result?.groups) {
            const { lastName } = result.groups;
            return lastName;
          }
        },
      },
      preferredName: {
        get() {
          const displayNameRegex =
            /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/gm;
          const result = displayNameRegex.exec(<string>this.name);

          // set name data
          if (result?.groups) {
            const { preferredName } = result.groups;
            return preferredName;
          }
        },
      },
      name: {
        get() {
          const displayNameRegex =
            /(?<lastName>\w+),(?<firstName>\w+)<?(?<preferredName>\w+)?>?/gm;
          const result = displayNameRegex.exec(<string>this.name);

          // set name data
          if (result?.groups) {
            const { firstName, lastName } = result.groups;
            return firstName + " " + lastName;
          }
        },
      },
    },
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

// exports User model.
export default models.User || model("User", UserSchema);

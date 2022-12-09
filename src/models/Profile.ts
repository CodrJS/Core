import { Schema, model } from "mongoose";

/* UserSchema will correspond to a collection in your MongoDB database. */
const UserProfileSchema = new Schema(
  {},
  {
    timestamps: true,
    virtuals: {},
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
const UserProfile = model("UserProfile", UserProfileSchema);
export default UserProfile;

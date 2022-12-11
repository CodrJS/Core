import { AccessibleRecordModel } from "@casl/mongoose";
import { Schema, model, Document } from "mongoose";

export interface IProfile extends Document {
  username: string;
  userId: Schema.Types.ObjectId;
}

const ProfileSchema = new Schema<IProfile>(
  {
    username: { type: String, required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// exports User model.
const Profile = model<IProfile, AccessibleRecordModel<IProfile>>(
  "Profile",
  ProfileSchema,
);
export default Profile;

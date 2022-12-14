import {
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { Schema, model, Document } from "mongoose";

export interface IProfile extends Document {
  username: string;
  userId: Schema.Types.ObjectId;
}

const ProfileSchema = new Schema<IProfile>(
  {
    username: { type: String, required: true, unique: true },
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
ProfileSchema.plugin(accessibleFieldsPlugin);
ProfileSchema.plugin(accessibleRecordsPlugin);
const Profile = model<IProfile, AccessibleModel<IProfile>>(
  "Profile",
  ProfileSchema,
);
export default Profile;

import {
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { Schema, model, Document, ObjectId } from "mongoose";

export interface Profile {
  avatarUrl?: string;
  username: string;
  user: Schema.Types.ObjectId;
}

export type IProfile = Profile & { _id: ObjectId };

const ProfileSchema = new Schema<Profile>(
  {
    username: { type: String, required: true, unique: true },
    avatarUrl: { type: String },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
  },
  {
    timestamps: true,
  },
);

// exports User model.
export type ProfileDocument = Profile & Document;
ProfileSchema.plugin(accessibleFieldsPlugin);
ProfileSchema.plugin(accessibleRecordsPlugin);
const Profile = model<ProfileDocument, AccessibleModel<ProfileDocument>>(
  "Profile",
  ProfileSchema,
);
export default Profile;

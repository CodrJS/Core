import {
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { Schema, model, Document, ObjectId } from "mongoose";

interface UserGroup {
  name: string;
  creator: ObjectId;
  members: ObjectId[];
  private: boolean;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

export type IUserGroup = UserGroup & {
  _id: ObjectId;
};

const UserGroupSchema = new Schema<UserGroup>(
  {
    name: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      immutable: true,
    },
    members: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      ],
      required: true,
      default: new Array<ObjectId>(),
    },
    private: {
      type: Boolean,
      default: false,
      required: true,
    },
    anonymous: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// exports UserGroup model.
export type UserGroupDocument = UserGroup & Document;
UserGroupSchema.plugin(accessibleFieldsPlugin);
UserGroupSchema.plugin(accessibleRecordsPlugin);
const UserGroup = model<UserGroupDocument, AccessibleModel<UserGroupDocument>>(
  "UserGroup",
  UserGroupSchema,
);
export default UserGroup;

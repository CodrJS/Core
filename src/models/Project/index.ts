import {
  accessibleFieldsPlugin,
  AccessibleModel,
  accessibleRecordsPlugin,
} from "@casl/mongoose";
import { Schema, model, Document, ObjectId } from "mongoose";
import Display, { DisplayConfig } from "./Display";
import General, { GeneralConfig } from "./General";
import Sample, { SampleConfig } from "./Sample";

export interface Project {
  $schema: string;
  creator: ObjectId;
  team: ObjectId;
  general: GeneralConfig;
  display: DisplayConfig;
  sample: SampleConfig;
}

export type IProject = Project & { _id: ObjectId };

const ProjectSchema = new Schema<Project>(
  {
    $schema: { type: String, required: true },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    team: {
      type: Schema.Types.ObjectId,
      ref: "UserGroup",
      default: undefined,
    },
    general: { type: General },
    display: { type: Display },
    sample: { type: Sample },
  },
  {
    timestamps: true,
  },
);

// exports User model.
export type ProjectDocument = Project & Document<ObjectId>;
ProjectSchema.plugin(accessibleFieldsPlugin);
ProjectSchema.plugin(accessibleRecordsPlugin);
const Project = model<ProjectDocument, AccessibleModel<ProjectDocument>>(
  "Project",
  ProjectSchema,
);
export default Project;

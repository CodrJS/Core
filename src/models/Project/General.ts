import { Schema, ObjectId } from "mongoose";

type TaskType = "classification" | "tagging" | "code-tagging" | "translation";

export interface GeneralConfig {
  title: string;
  type: TaskType;
  slug: string;
  bgColorClass: string;
  guidelines?: string;
  anonymize: boolean;
  private: boolean;
}

export type IGeneralConfig = GeneralConfig & { _id: ObjectId };
// type IGeneralConfigDocument = IGeneralConfig & Document<ObjectId>;

const GeneralConfigSchema = new Schema<GeneralConfig>(
  {
    title: { type: String, required: true },
    type: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      match: [
        /[\w-]{3,}/,
        "The slug needs to be at least 3 characters; Can include: a-z, A-Z, 0-9, _, -",
      ],
    },
    bgColorClass: { type: String, required: true },
    guidelines: { type: String },
    anonymize: { type: Boolean, required: true, default: false },
    private: { type: Boolean, required: true, default: false },
  },
  {
    timestamps: true,
  },
);

export default GeneralConfigSchema;

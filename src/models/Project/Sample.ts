import { Schema, ObjectId } from "mongoose";

export interface SampleConfig {
  skipVerification: boolean;
  model: Record<string, any>;
}

export type ISampleConfig = SampleConfig & { _id: ObjectId };
// type ISampleConfigDocument = ISampleConfig & Document<ObjectId>;

const SampleConfigSchema = new Schema<SampleConfig>(
  {
    skipVerification: { type: Boolean, required: true, default: false },
    model: { type: Object, required: true, default: {} },
  },
  {
    timestamps: true,
  },
);

// const Sample = model<ISampleConfigDocument>("SampleConfig", SampleConfigSchema);
export default SampleConfigSchema;

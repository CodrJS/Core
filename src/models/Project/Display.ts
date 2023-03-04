import { Schema, ObjectId } from "mongoose";

type InputField = "text";
type OutputField =
  | "short-text"
  | "long-text"
  | "radio"
  | "multiple-choice"
  | "range";

// what the researchers provide to display to users
export interface Input {
  type: InputField;
  value?: string;
  format?: string;
  collapsible?: boolean;
  header?: string;
}

// where the user provides their annotation
export interface Output {
  type: OutputField;
  prompt?: string;
  /** Range is a tupple, [min, max] */
  range?: [number, number];
  options?: string | { key: string; value: string | number }[];
}

export interface DisplayConfig {
  inputs: Array<Input>;
  outputs: Array<Output>;
}

export type IDisplayConfig = DisplayConfig & { _id: ObjectId };
// type IDisplayConfigDocument = IDisplayConfig & Document<ObjectId>;

const DisplayConfigSchema = new Schema<DisplayConfig>(
  {
    inputs: {
      type: new Array<Input>(),
      required: true,
      default: new Array<Input>(),
      minlength: 1,
    },
    outputs: {
      type: new Array<Output>(),
      required: true,
      default: new Array<Output>(),
      minlength: 1,
    },
  },
  {
    timestamps: true,
  },
);

// const Display = model<IDisplayConfigDocument>(
//   "DisplayConfig",
//   DisplayConfigSchema,
// );
export default DisplayConfigSchema;

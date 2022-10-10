import Colors, { BgColorType } from "types/Colors";

// classification and translation to be implemented first
type TaskType = "classification" | "labeling" | "code-labeling" | "translation";
type InputField = "text";
type OutputField =
  | "short-text"
  | "long-text"
  | "radio"
  | "multiple-choice"
  | "range";

// what the researchers provide to display to users
interface Input<V> {
  type: InputField;
  language?: string;
  value: V;
}

// where the user provides their annotation
interface Output {
  type: OutputField;
  range?: [number, number]; // [min, max]
}

export interface ConfigOptions {
  general: {
    type: TaskType;
    title: string;
    slug?: string;
    bgColorClass?: BgColorType;
    guidelines?: string;
  };
  display: { inputs: Input<unknown>[]; outputs: Output[] };
  model?: Record<string, unknown>;
}

class ProjectConfiguration {
  type: TaskType;
  title: string;
  slug: string;
  bgColorClass: BgColorType;
  guidelines: string;
  display: { inputs: Input<unknown>[]; outputs: Output[] };
  model?: Record<string, unknown>;
  static from: (options: ConfigOptions) => ProjectConfiguration;

  constructor(options: ConfigOptions) {
    this.type = options.general.type;
    this.title = options.general.title;
    this.display = options.display;
    this.model = options.model;

    if (options.general.slug) {
      this.slug = options.general.slug;
    } else {
      const date = new Date().toISOString().split("T")[0];
      this.slug = `${this.title
        .toLocaleLowerCase()
        .replace(/\s+/g, "-")}-${date}`;
    }

    if (options.general.bgColorClass) {
      this.bgColorClass = options.general.bgColorClass;
    } else {
      const num = Math.floor(Math.random() * Colors.bgClasses.length);
      this.bgColorClass = Colors.bgClasses[num];
    }

    if (options.general.guidelines) {
      this.guidelines = options.general.guidelines;
    } else {
      this.guidelines =
        "No guidelines were provided in project configuration.\n\nTo add guidelines, go to settings » guidelines.";
    }
  }
}

ProjectConfiguration.from = function (options: ConfigOptions) {
  return new ProjectConfiguration(options);
};

export default ProjectConfiguration;

import ProjectConfiguration, { ConfigOptions } from "../models/Config";
import options from "../examples/project.json";

describe("Project Configuration", () => {
  const options2: ConfigOptions = JSON.parse(JSON.stringify(options));
  delete options2.general.slug;
  delete options2.general.guidelines;
  delete options2.general.bgColorClass;

  it("does not throw an error", () => {
    const config = ProjectConfiguration.from(
      options as unknown as ConfigOptions,
    );

    expect(config.bgColorClass).toBe("bg-pink-600");
    expect(config.title).toBe("My Project");
    expect(config.display.inputs[1]).toEqual({
      type: "text",
      language: "Java",
      value: "model.data.methods.*.src_code",
    });
  });

  it("generates missing options", () => {
    const config = ProjectConfiguration.from(options2);

    expect(config.slug).toBe(
      `my-project-${new Date().toISOString().split("T")[0]}`,
    );
    expect(config.display.inputs[1]).toEqual({
      type: "text",
      language: "Java",
      value: "model.data.methods.*.src_code",
    });
  });
});

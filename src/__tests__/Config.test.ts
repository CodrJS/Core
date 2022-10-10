import ProjectConfiguration, { ConfigOptions } from "../models/Config";

describe("Project Configuration", () => {
  const options: ConfigOptions = {
    general: {
      type: "code-labeling",
      title: "My Project",
      slug: "my-project",
      bgColorClass: "bg-pink-600",
      guidelines: "My guidelines go here.",
    },
    display: {
      inputs: [
        {
          type: "text",
          language: "Java",
          value: "class MyClass {}",
        },
        {
          type: "text",
          language: "Java",
          value: "class MyClass2 {}",
        },
      ],
      outputs: [
        {
          type: "range",
          range: [1, 10],
        },
        {
          type: "short-text",
        },
      ],
    },
    model: {
      type: "string",
      id: "string",
    },
  };

  const options2: ConfigOptions = JSON.parse(JSON.stringify(options));
  delete options2.general.slug;
  delete options2.general.guidelines;
  delete options2.general.bgColorClass;

  it("does not throw an error", () => {
    const config = ProjectConfiguration.from(options);

    expect(config.bgColorClass).toBe("bg-pink-600");
    expect(config.title).toBe("My Project");
    expect(config.display.inputs[0]).toEqual({
      type: "text",
      language: "Java",
      value: "class MyClass {}",
    });
  });

  it("generates missing options", () => {
    const config = ProjectConfiguration.from(options2);

    expect(config.slug).toBe(`my-project-${new Date().toISOString().split("T")[0]}`);
    expect(config.display.inputs[0]).toEqual({
      type: "text",
      language: "Java",
      value: "class MyClass {}",
    });
  });
});

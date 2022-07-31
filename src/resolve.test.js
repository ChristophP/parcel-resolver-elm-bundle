const resolve = require("./resolve");

describe("the resolver", () => {
  test("resolves to new JS source code if bundle is defined in specifier", async () => {
    const __testConfig = {
      files: [{ filePath: "/peter/package.json" }],
      config: {
        "elm-bundle": {
          "widget-a": ["./src/Main.elm", "./src/MainB.elm", "./src/MainC.elm"],
        },
      },
    };

    const dependency = { sourcePath: "/peter/src/Main.elm" };
    const options = {};
    const specifier = "elm-bundle:widget-a";
    const result = await resolve({
      dependency,
      options,
      specifier,
      __testConfig,
    });
    const expected = {
      code: 'export * from "./src/Main.elm?MainB.elm&MainC.elm";',
      filePath: "/peter/index.js",
      invalidateOnFileChange: ["/peter/package.json"],
      invalidateOnFileCreate: [
        { aboveFilePath: "/peter/src/Main.elm", fileName: "package.json" },
      ],
    };
    expect(result).toStrictEqual(expected);
  });

  test("returns undefined when bundle does not exist", async () => {
    const __testConfig = {
      files: [{ filePath: "/peter/package.json" }],
      config: {
        "elm-bundle": {},
      },
    };

    const dependency = { sourcePath: "/peter/src/Main.elm" };
    const options = {};
    const specifier = "elm-bundle:widget-a";
    const result = await resolve({
      dependency,
      options,
      specifier,
      __testConfig,
    });
    const expected = {
      diagnostics: {
        message:
          'No module defined with name "widget-a" in /peter/package.json',
      },
      invalidateOnFileChange: ["/peter/package.json"],
      invalidateOnFileCreate: [
        { aboveFilePath: "/peter/src/Main.elm", fileName: "package.json" },
      ],
    };
    expect(result).toStrictEqual(expected);
  });

  test("returns undefined when no config exists at all", async () => {
    const __testConfig = {
      files: [{ filePath: "/peter/package.json" }],
      config: {},
    };

    const dependency = { sourcePath: "/peter/src/Main.elm" };
    const options = {};
    const specifier = "elm-bundle:widget-a";
    const result = await resolve({
      dependency,
      options,
      specifier,
      __testConfig,
    });
    expect(result).toStrictEqual(undefined);
  });
});

const {loadConfig} = require('@parcel/utils');
const {md} = require('@parcel/diagnostic');
const nullthrows = require('nullthrows');
const path = require('path');

async function resolve({dependency, options, specifier, __testConfig}) {
  let parent = dependency.sourcePath;
  if (specifier.startsWith('elm-bundle:') && parent != null) {
    let name = specifier.slice('elm-bundle:'.length);

    let pkg = __testConfig ??
      await loadConfig(
        options.inputFS,
        parent,
        ['package.json'],
        options.projectRoot,
      );

    let invalidateOnFileChange = pkg?.files.map(f => f.filePath) ?? [];
    let invalidateOnFileCreate = [
      {fileName: 'package.json', aboveFilePath: parent},
    ];

    let modules = pkg?.config['elm-bundle'];
    if (modules) {
      let pkgFile = nullthrows(pkg?.files)[0].filePath;
      let pkgDir = path.dirname(pkgFile);
      let mod = modules[name];
      if (mod != null && mod.length > 0) {
        let mainPath = path.resolve(pkgDir, mod[0]);
        let mainDir = path.dirname(mainPath);

        let newSpecifier = `${mod[0]}?${mod
          .slice(1)
          .map(m => path.relative(mainDir, path.resolve(pkgDir, m)))
          .join('&')}`;

        return {
          invalidateOnFileChange,
          invalidateOnFileCreate,
          filePath: path.join(pkgDir, 'index.js'),
          code: `export * from "${newSpecifier}";`,
        };
      } else {
        return {
          invalidateOnFileChange,
          invalidateOnFileCreate,
          diagnostics: {
            message: md`No module defined with name "${name}" in ${pkgFile}`,
          }
        };
      }

      return {
        invalidateOnFileChange,
        invalidateOnFileCreate,
      };
    }
  }
}

module.exports = resolve;

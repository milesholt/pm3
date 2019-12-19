
//NOTES
//This resolves the issue with Angular 6+ not resolving 'fs' or other node modules.
//what this is doing is like the file 'f' and replacing a line of code. But for some reason I can't get this patch to load when building the package.json so I've had to do it manually.

const fs = require('fs');
const f = 'node_modules/@angular-devkit/build-angular/src/angular-cli-files/models/webpack-configs/browser.js';

fs.readFile(f, 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  //var result = data.replace(/node: false/g, 'node: {crypto: true, stream: true, fs: \'empty\' }');
  var result = data.replace(/node: false/g, "node: {fs: 'empty', global: true, crypto: 'empty', tls: 'empty', net: 'empty', process: true, module: false, clearImmediate: false, setImmediate: false}");

  fs.writeFile(f, result, 'utf8', function (err) {
    if (err) return console.log(err);
  });
});

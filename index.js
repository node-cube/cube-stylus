var fs = require('fs');
var path = require('path');
var stylus = require('stylus');


function StylusProcessor(cube) {
  this.cube = cube;
}
StylusProcessor.info = {
  type: 'style',
  ext: '.styl'
};

StylusProcessor.prototype = {
  process: function (file, options, callback) {
    var root = options.root;
    var code, codeRes;
    code = fs.readFileSync(path.join(root, file)).toString();
    try {
      codeRes = stylus.render(code, {compress: options.compress});
    } catch (e) {
      return callback(e);
    }
    var res = {
      source: code,
      code: codeRes
    };
    if (options.moduleWrap) {
      res.wraped = this.cube.wrapStyle(options.qpath, codeRes);
    }
    callback(null, res);
  }
};

module.exports = StylusProcessor;
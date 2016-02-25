var fs = require('fs');
var path = require('path');
var stylus = require('stylus');


function StylusProcessor(cube) {
  this.cube = cube;
}
StylusProcessor.type = 'style';
StylusProcessor.ext = '.styl';

StylusProcessor.prototype.process = function (data, callback) {
  var config = this.cube.config;
  var root = config.root;
  var code = data.code;
  var file = data.realPath;
  var codeRes;
  try {
    data.code = stylus.render(code, {compress: data.compress || config.compress});
  } catch (e) {
    var tmp = e.message.split('\n')[0].split(':');
    e.code = 'Stylus_Parse_Error';
    e.file = file;
    e.line = Number(tmp[1]);
    e.column = Number(tmp[2]);
    return callback(e);
  }
  callback(null, data);
};

module.exports = StylusProcessor;
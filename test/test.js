var TestMod = require('../index');
var expect = require('expect.js');
var fs = require('fs');
var path = require('path');

describe('cube-styl', function () {
  it('expect info', function () {
    expect(TestMod.type).to.be('style');
    expect(TestMod.ext).to.be('.styl');
  });
  it('expect processor styl file fine', function (done) {
    var file = '/test.styl';
    var code = fs.readFileSync(path.join(__dirname, file)).toString();
    var data = {
      queryPath: '/test.styl',
      code: code,
      source: code
    };
    var cube = {
      config: {
        release: false,
        moduleWrap: true,
        compress: true
      },
      wrapStyle: function (qpath, code) {
        return 'Cube("' + qpath + '", [], function(m){m.exports=' + JSON.stringify(code) + ';return m.exports});';
      }
    };

    function Cube(mod, requires, cb) {
      expect(mod).to.be('/test.styl');
      expect(requires).to.eql([]);
      var tpl = cb({});
      expect(tpl).to.match(/\.test_styl a\s*\{/);
      done();
    }
    var processor = new TestMod(cube);
    processor.process(data, function (err, res) {
      expect(err).to.be(null);
      expect(res).have.keys(['source', 'code']);
      expect(res.source).match(/\.test_styl\s+a\s*/);
      expect(res.code).to.match(/\.test_styl a\s*\{/);
      var wraped = cube.wrapStyle(file, res.code);
      eval(wraped);
    });
  });

  it('expect processor error styl file, return error', function (done) {
    require = function () {
      return {};
    };
    var file = '/test_err.styl';
    var code = fs.readFileSync(path.join(__dirname, file)).toString();
    var data = {
      queryPath: '/test.styl',
      code: code,
      source: code
    };
    var cube = {
      config: {
        release: false,
        moduleWrap: true,
        compress: true
      },
      wrapStyle: function (qpath, code) {
        return 'Cube("' + qpath + '", [], function(m){m.exports=' + JSON.stringify(code) + ';return m.exports});';
      }
    };
    var processor = new TestMod(cube);
    processor.process(data, function (err, res) {
      expect(err).to.be.ok();
      expect(err.code).to.be('Stylus_Parse_Error');
      done();
    });
  });
});
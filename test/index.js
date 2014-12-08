var fs = require('graceful-fs');
var path = require('path');
var test = require('tape');
var rimraf = require('rimraf');
var stream = require('stream');
var diff = require('./diff');
var cprf = require('../');

// fixtures
// ├── another_file.txt
// ├── bad_symlink.txt -> ./notexists
// ├── dir_1_level
// │   ├── another_file.txt
// │   └── file.txt
// ├── dir_2_levels
// │   ├── another_file.txt
// │   ├── child_dir
// │   │   ├── another_file.txt
// │   │   └── file.txt
// │   └── file.txt
// ├── dir_3_levels
// │   └── child_dir
// │       ├── another_file.txt
// │       ├── file.txt
// │       └── orphan_dir
// ├── executable
// ├── file.txt
// └── good_symlink.txt -> file.txt

var src = __dirname + '/fixtures';
var dest = __dirname + '/fixtures_copy';


test('setup', function (t) {
  rimraf(dest, t.end);
});


test('plain cprf', function (t) {
  cprf(src, dest, function (e) {
    t.error(e, 'should not error');
    diff(src, dest, t, t.end);
  });
});

test('transforming copy listener', function (t) {
  cprf(src, dest, function (e) {
    t.error(e, 'should not error');
    diff(src, dest, t, t.end);
  }).on('copy', function (stats, src, dest, copy) {
    var transform = new stream.Transform();
    transform._transform = function (chunk, enc, cb) {
      cb(null, chunk);
    };

    copy(src, dest, transform);
  });
});

test('transforming copy listener modifying destination filename', function (t) {
  var _src = path.join(src, 'file.txt');
  var _dest = path.join(dest, 'file.txt');

  cprf(_src, _dest, function (e) {
    t.error(e, 'should not error');
    diff(_src, _dest + '.test', t, t.end);
  })
  .on('copy', function (stats, src, dest, copy) {
    copy(src, dest + '.test', null);
  });
});

test('teardown', function (t) {
  rimraf(dest, t.end);
});


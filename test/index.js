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

test('cprf without transform', function(t) {
  cprf(src, dest, function (e) {
    t.error(e, 'should not error');
    diff(src, dest, t, t.end);
  });
});

test('cprf with transform', function(t) {
  var transform = new stream.Transform();
  transform._transform = function (data, enc, cb) {
    cb(null, data);
  };

  cprf(src, dest, transform, function (e) {
    t.error(e, 'should not error');
    diff(src, dest, t, t.end);
  });
});

test('teardown', function (t) {
  rimraf(dest, t.end);
});


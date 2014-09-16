var fs = require('fs');
var path = require('path');
var assert = require('assert');
var async = require('async');
var test = require('tape');
var rimraf = require('rimraf');
var cprf = require('../');

// fixtures:
// .
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
// ├── file.txt
// └── good_symlink.txt -> file.txt

// 6 directories, 12 files

function diff (src, dest, t, done) {
  async.parallel([
    async.apply(fs.lstat, src),
    async.apply(fs.lstat, dest)
  ], function (err, results) {
    if (err) return done(new Error(err));

    // TODO: make better file diff
    var relevantStats = results.map(function (stat) {
      return [
        stat.dev,     stat.mode, stat.nlink, 
        stat.uid,     stat.gid,  stat.rdev,
        stat.blksize, stat.size, stat.blocks
      ];
    })

    t.deepEqual(
      relevantStats[0], 
      relevantStats[1], 
      src + ' and ' + dest + ' are the same');

    if (!results[0].isDirectory()) return done();

    return fs.readdir(src, function (err, files) {
      if (err) return done(new Error(err));
      async.each(files, function(filename, done) {
        diff(
          path.join(src, filename), 
          path.join(dest, filename), 
          t, done);
      }, done);
    });
  });
}

var src = __dirname + '/fixtures';
var dest = __dirname + '/fixtures_copy';

test('cprf', function(t) {
  try {
    cprf(src, dest, function (e) {
      if (e) return done(e);
      diff(src, dest, t, done)
    });
  } catch (e) {
    return done(e)
  }

  function done (e) {
    rimraf(__dirname + '/fixtures_copy', function (error) {
      if (error) throw error;
      t.end();
    });

    if (e) throw e;
  }
});

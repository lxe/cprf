var fs = require('fs');
var path = require('path');
var parallel = require('run-parallel');

module.exports = diff;

var statParams = [
  'dev',
  'mode',
  'nlink',
  'uid',
  'gid',
  'rdev',
  'size'
];

function diff (src, dest, t, done) {
  parallel([
    fs.lstat.bind(fs, dest),
    fs.lstat.bind(fs, src)
  ], function (err, results) {
    if (err) return done(err);

    statParams.forEach(function (param) {
      t.equal(
        results[0][param],
        results[1][param],
        path.basename(src) + ' stat.' + param);
    });

    // Files
    if (results[0].isFile()) {
      return parallel([
        fs.readFile.bind(fs, dest),
        fs.readFile.bind(fs, src),
      ], function (err, data) {
        if (err) return done(err);

        t.deepEqual(
          data[0],
          data[1],
          path.basename(src) + ' contents');

        return done(null);
      });
    }

    // Directories
    if (results[0].isDirectory()) {
      return fs.readdir(src, function (err, files) {
        if (err) return done(err);

        parallel(files.map(function (file) {
          return diff.bind(null,
            path.join(src, file),
            path.join(dest, file),
            t);
        }), done);
      });
    }

    // Everything else
    done(null);
  });
};

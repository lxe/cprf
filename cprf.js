var fs = require('graceful-fs');
var path = require('path');
var parallel = require('run-parallel');
var stream = require('stream');
var events = require('events');

module.exports = cprf;
module.exports.copy = copy;

function cprf () {
  return copy.apply(
    new events.EventEmitter(),
    [].slice.call(arguments)
  );
}

function copy (src, dest, done) {
  var ee = this;

  function _error (err) {
    var deepError = new Error(err);
    ee.emit('error', deepError);
    return done(deepError);
  }

  fs.lstat(src, function (err, stats) {
    if (err) return _error(err);

    ee.emit('copy', stats, src, dest, _copy, done);

    if (!ee.listeners('copy').length) {
      return _copy(src, dest, null);
    }

    function _copy (src, dest, transform) {

      // Directory
      if (stats.isDirectory()) {
        return fs.mkdir(dest, function (err) {
          if (err && err.code !== 'EEXIST') {
            return _error(err);
          }

          fs.readdir(src, function (err, files) {
            if (err) return _error(err);

            parallel(files.map(function (file) {
              return copy.bind(ee,
                path.join(src, file),
                path.join(dest, file));
            }), done);

          });
        });
      }

      // Symlink
      if (stats.isSymbolicLink()) {
        return fs.readlink(src, function (err, link) {
          if (err) return _error(err);

          fs.symlink(link, dest, function (err) {
            done(null);
          });
        });
      }

      // File
      var fin = fs.createReadStream(src);
      fin.on('error', _error);

      var fout = fs.createWriteStream(dest);
      fout.on('error', _error);

      fout.on('finish', function () {
        fs.chmod(dest, stats.mode, done);
      });

      if (transform) {
        fin.pipe(transform).pipe(fout);
      } else {
        fin.pipe(fout);
      }
    }

  });

  return ee;
}

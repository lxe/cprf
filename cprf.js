var fs = require('graceful-fs');
var path = require('path');
var async = require('async');

module.exports = copy;

function copy (src, dest, done) {
  fs.lstat(src, function (err, stats) {
    if (err) return done(new Error(err));

    if (stats.isDirectory()) {
      return mkdir(dest, function (err) {
        if (err) return done(new Error(err));
        return fs.readdir(src, function (err, files) {
          if (err) return done(new Error(err));
          async.each(files, function (file, done) {
            copy(path.join(src, file), path.join(dest, file), done);
          }, done);
        });
      });
    }

    if (stats.isSymbolicLink()) {
      return fs.readlink(src, function (err, link) {
        if (err) return done(new Error(err));
        fs.symlink(link, dest, function (err) {
          done();
        });
      });
    }

    copyFile(src, dest, function (err) {
      if (err) return done(err);
      fs.chmod(dest, stats.mode, done);
    });

  });
}

function mkdir (dir, done) {
  fs.exists(dir, function (exists) {
    return exists ? done() : fs.mkdir(dir, done);
  });
}

function copyFile (src, dest, done) {
  var doneCalled = false;

  var fin = fs.createReadStream(src);
  fin.on('error', finish);

  var fout = fs.createWriteStream(dest);
  fout.on('error', finish);
  fout.on('close', finish);

  fin.pipe(fout);

  function finish (err) {
    if (doneCalled) return;
    doneCalled = true;
    done(err);
  }
}

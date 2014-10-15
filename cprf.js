var fs = require('graceful-fs');
var path = require('path');
var parallel = require('run-parallel');
var stream = require('stream');

module.exports = cprf;

function cprf (src, dest, transform, done) {
  if (!done) {
    done = transform;
    transform = null;
  }

  return copy(src, dest, transform, done);
}

function copy (src, dest, transform, done) {
  fs.lstat(src, function (err, stats) {
    if (err) return done(new Error(err));

    // Directory
    if (stats.isDirectory()) {
      return mkdir(dest, function (err) {
        if (err) return done(new Error(err));

        return fs.readdir(src, function (err, files) {
          if (err) return done(new Error(err));

          parallel(files.map(function (file) {
            return copy.bind(null,
              path.join(src, file),
              path.join(dest, file),
              transform);
          }), done);

        });
      });
    }

    // Symlink
    if (stats.isSymbolicLink()) {
      return fs.readlink(src, function (err, link) {
        if (err) return done(new Error(err));

        fs.symlink(link, dest, function (err) {
          done();
        });
      });
    }

    // File
    copyFile(src, dest, transform, function (err) {
      if (err) return done(err);

      fs.chmod(dest, stats.mode, done);
    });

  });
}

function mkdir (dir, done) {
  fs.exists(dir, function (exists) {
    return exists ?
      done() :
      fs.mkdir(dir, done);
  });
}

function copyFile (src, dest, transform, done) {
  var doneCalled = false;

  function finish (err) {
    console.log(src, err);
    if (doneCalled) return;

    doneCalled = true;
    done(err);
  }

  var fin = fs.createReadStream(src);
  fin.once('error', finish);

  var fout = fs.createWriteStream(dest);
  fout.once('error', finish);

  if (transform) {
    transform.on('error', finish);

    transform.on('finish', finish);
    fin.pipe(transform).pipe(fout)
  } else {
    fout.on('finish', finish);
    fin.pipe(fout);
  }
}

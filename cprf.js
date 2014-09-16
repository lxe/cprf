var fs = require('fs');
var path = require('path');
var async = require('async');

function mkdir (dir, done) {
  fs.exists(dir, function (exists) {
    if (exists) return done();
    fs.mkdir(dir, function (err) {
      if (err) return done(new Error(err));
      done();
    });
  });
}

function copy (src, dest, done) {
  fs.lstat(src, function (err, stats) {
    if (err) return done(new Error(err));

    if (stats.isDirectory()) {
      return mkdir(dest, function (err) {
        if (err) return done(new Error(err));
        return fs.readdir(src, function (err, files) {
          if (err) return done(new Error(err));
          async.each(files, function(filename, done) {
            copy(
              path.join(src, filename), 
              path.join(dest, filename), 
              done);
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

    var fin = fs.createReadStream(src);
    var fout = fs.createWriteStream(dest);

    fin.on('end', function () {
      fs.chmod(dest, stats.mode, function (err) {
        if (err) return done(new Error(err));
        done();
      });
    });
    fin.on('error', done);
    fin.pipe(fout);
  });
}

module.exports = copy;

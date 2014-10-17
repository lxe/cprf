# cprf

[![Build Status](https://travis-ci.org/lxe/cprf.svg)](https://travis-ci.org/lxe/cprf)
[![Dependency Status](https://david-dm.org/lxe/cprf.svg?theme=shields.io)](https://david-dm.org/lxe/cprf)
[![devDependency Status](https://david-dm.org/lxe/cprf/dev-status.svg?theme=shields.io)](https://david-dm.org/lxe/cprf#info=devDependencies)

Asynchronously, recursively copy directories and files.

## Features

 - Copies broken symlinks
 - Always overwrites destination
 - Automatically creates non-existing directories
 - Strictly programmatic approach
 - Simple usage interface
 - Customizeable copy action
 - Fully asynchronous
 - Uses graceful-fs to retry EMFILE errors
 - Tests!

## Installation

```javascript
npm install cprf
```

## Usage

To copy `./my_source` to `./my_destination`:

```javascript
var cprf = require('cprf');

cprf('./my_source', './my_destination', function (err) {
  if (err) throw err;
});
```

You can also completely customize the copy procedure by listening to the `copy` event. This allows you to do things like changing destination file names and modifying file contents on copy.

```javascript
var cprf = require('cprf');
var stream = require('stream');

var makeUpperCase = new stream.Transform();
makeUpperCase._transform = function (chunk, enc, cb) {
  cb(null, chunk.toString().toUpperCase());
};

cprf('./my_source', './my_destination', function (err) {
  if (err) throw err;
}).on('copy', function (stats, src, dest, copy) {
  copy(src, dest, makeUpperCase);
});
```

The `copy` event emits the following data:

 - `stats` - the `[fs.Stat](http://nodejs.org/api/fs.html#fs_class_fs_stats)` object resulting from running `[fs.lstat()](http://nodejs.org/api/fs.html#fs_fs_lstat_path_callback)` on the source;
 - `src` - the absolute source path;
 - `dest` - the absolute destination path;
 - `copy` - a function of signature `copy(src, dest, transform)`. You must call it if you wish to actually perform a copy operation. It takes the following arguments:
   - `src` - the absolute source path;
   - `dest` - the absolute destination path;
   - `transform` - a [stream.Transform](http://nodejs.org/api/stream.html#stream_class_stream_transform) instance through which the source file contents will be piped before being written to the destination. If the source is not a file, it will be ignored.

## Changelog

#### 2.0.0

 - Add ability to customize copy procedure via the copy event.

#### 1.1.0

 - No longer need concurrency limit using graceful-fs

#### 1.0.0

 - Add default/adjustable concurrency limit

#### 0.1.2

 - Fixed/enable file mode duplication

## License

Copyright (c) 2014, Aleksey Smolenchuk <lxe@lxe.co>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

# cprf

[![Build Status](https://travis-ci.org/lxe/cprf.svg)](https://travis-ci.org/lxe/cprf)
[![Dependency Status](https://david-dm.org/lxe/cprf.svg?theme=shields.io)](https://david-dm.org/lxe/cprf)
[![devDependency Status](https://david-dm.org/lxe/cprf/dev-status.svg?theme=shields.io)](https://david-dm.org/lxe/cprf#info=devDependencies)

Asynchronously, recursively copy directories and files.

## Features

 - Copies broken symlinks
 - Fully asynchronous
 - Limits file descriptors to 24 (per invocation)
 - Attempts to call back with meaningful errors
 - Tests!

## Installation

```javascript
npm install cprf
```

## Usage

```javascript
var cprf = require('cprf');

cprf('./my_source', './my_destination', function (err) {
  if (err) {
    console.error(err);
  }
}, 24);

/// where '24' is the asynchronous concurrency limit.
```

## Changelog

#### 1.0.0

 - Add default/adjustable concurrency limit

#### 0.1.2

 - Fixed/enable file mode duplication

## TODOs

 - Add automatic concurrency limiting based on open file descriptors

## License

Copyright (c) 2014, Aleksey Smolenchuk <lxe@lxe.co>

Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF
THIS SOFTWARE.

var TS = require('stream').Transform;
var fs = require('fs');

var t = new TS();



t._transform = function (c, en, cb) {
  cb(null, 'this is the new data: ' + c);
}

var fileReader = fs.createReadStream('testData');
var fileWriter = fs.createWriteStream('testData.out');

var pipe = fileReader.pipe(t).pipe(fileWriter);

fileReader.on('end', function() {
  console.log('fileReader end called');
});
fileReader.on('close', function() {
  console.log('fileReader close called');
});

fileWriter.on('end', function() {
  console.log('fileWriter end called');
});
fileWriter.on('finish', function() {
  console.log('fileWriter finish called');
});
fileWriter.on('close', function() {
  console.log('fileWriter close called');
});

t.on('end', function() {
  console.log('t end called');
});
t.on('finish', function() {
  console.log('t finish called');
});


pipe.on('end', function() {
  console.log('pipe end called');
});
pipe.on('finish', function() {
  console.log('pipe finish called');
});
pipe.on('close', function() {
  console.log('pipe close called');
});


"use strict";

var _asyncToGenerator = require("@babel/runtime/helpers/asyncToGenerator");

var _Object$values = require("@babel/runtime/core-js/object/values");

var _Promise = require("@babel/runtime/core-js/promise");

var _asyncIterator = require("@babel/runtime/helpers/asyncIterator");

var _awaitAsyncGenerator = require("@babel/runtime/helpers/awaitAsyncGenerator");

var _wrapAsyncGenerator = require("@babel/runtime/helpers/wrapAsyncGenerator");

var _getIterator = require("@babel/runtime/core-js/get-iterator");

var _regeneratorRuntime = require("@babel/runtime/regenerator");

var _marked =
/*#__PURE__*/
_regeneratorRuntime.mark(walkPath),
    _marked2 =
/*#__PURE__*/
_regeneratorRuntime.mark(walkPaths);

var fs = require('fs');

var path = require('path');

var StreamZip = require('node-stream-zip');

function walkPath(p) {
  var stat;
  return _regeneratorRuntime.wrap(function walkPath$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          stat = fs.statSync(p);

          if (!stat.isDirectory()) {
            _context.next = 6;
            break;
          }

          return _context.delegateYield(walkPaths(fs.readdirSync(p).map(function (f) {
            return path.join(p, f);
          })), "t0", 4);

        case 4:
          _context.next = 9;
          break;

        case 6:
          if (!stat.isFile()) {
            _context.next = 9;
            break;
          }

          _context.next = 9;
          return p;

        case 9:
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t1 = _context["catch"](0);
          console.error(_context.t1.message);

        case 14:
        case "end":
          return _context.stop();
      }
    }
  }, _marked, this, [[0, 11]]);
}

function walkPaths(ps) {
  var _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _p;

  return _regeneratorRuntime.wrap(function walkPaths$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _iteratorNormalCompletion = true;
          _didIteratorError = false;
          _iteratorError = undefined;
          _context2.prev = 3;
          _iterator = _getIterator(ps);

        case 5:
          if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
            _context2.next = 11;
            break;
          }

          _p = _step.value;
          return _context2.delegateYield(walkPath(_p), "t0", 8);

        case 8:
          _iteratorNormalCompletion = true;
          _context2.next = 5;
          break;

        case 11:
          _context2.next = 17;
          break;

        case 13:
          _context2.prev = 13;
          _context2.t1 = _context2["catch"](3);
          _didIteratorError = true;
          _iteratorError = _context2.t1;

        case 17:
          _context2.prev = 17;
          _context2.prev = 18;

          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }

        case 20:
          _context2.prev = 20;

          if (!_didIteratorError) {
            _context2.next = 23;
            break;
          }

          throw _iteratorError;

        case 23:
          return _context2.finish(20);

        case 24:
          return _context2.finish(17);

        case 25:
        case "end":
          return _context2.stop();
      }
    }
  }, _marked2, this, [[3, 13, 17, 25], [18,, 20, 24]]);
}

function walkClassFiles(_x) {
  return _walkClassFiles.apply(this, arguments);
}

function _walkClassFiles() {
  _walkClassFiles = _wrapAsyncGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee2(files) {
    var _iteratorNormalCompletion4, _didIteratorError4, _iteratorError4, _iterator4, _step4, _file, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _value, classFile;

    return _regeneratorRuntime.wrap(function _callee2$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _iteratorNormalCompletion4 = true;
            _didIteratorError4 = false;
            _iteratorError4 = undefined;
            _context4.prev = 3;
            _iterator4 = _getIterator(files);

          case 5:
            if (_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done) {
              _context4.next = 50;
              break;
            }

            _file = _step4.value;

            if (!_file.endsWith(".class")) {
              _context4.next = 12;
              break;
            }

            _context4.next = 10;
            return {
              classFile: _file
            };

          case 10:
            _context4.next = 47;
            break;

          case 12:
            if (!_file.endsWith(".jar")) {
              _context4.next = 47;
              break;
            }

            _iteratorNormalCompletion2 = true;
            _didIteratorError2 = false;
            _context4.prev = 15;
            _iterator2 = _asyncIterator(walkClassFilesInJar(_file));

          case 17:
            _context4.next = 19;
            return _awaitAsyncGenerator(_iterator2.next());

          case 19:
            _step2 = _context4.sent;
            _iteratorNormalCompletion2 = _step2.done;
            _context4.next = 23;
            return _awaitAsyncGenerator(_step2.value);

          case 23:
            _value = _context4.sent;

            if (_iteratorNormalCompletion2) {
              _context4.next = 31;
              break;
            }

            classFile = _value;
            _context4.next = 28;
            return {
              classFile: classFile,
              jarFile: _file
            };

          case 28:
            _iteratorNormalCompletion2 = true;
            _context4.next = 17;
            break;

          case 31:
            _context4.next = 37;
            break;

          case 33:
            _context4.prev = 33;
            _context4.t0 = _context4["catch"](15);
            _didIteratorError2 = true;
            _iteratorError2 = _context4.t0;

          case 37:
            _context4.prev = 37;
            _context4.prev = 38;

            if (!(!_iteratorNormalCompletion2 && _iterator2.return != null)) {
              _context4.next = 42;
              break;
            }

            _context4.next = 42;
            return _awaitAsyncGenerator(_iterator2.return());

          case 42:
            _context4.prev = 42;

            if (!_didIteratorError2) {
              _context4.next = 45;
              break;
            }

            throw _iteratorError2;

          case 45:
            return _context4.finish(42);

          case 46:
            return _context4.finish(37);

          case 47:
            _iteratorNormalCompletion4 = true;
            _context4.next = 5;
            break;

          case 50:
            _context4.next = 56;
            break;

          case 52:
            _context4.prev = 52;
            _context4.t1 = _context4["catch"](3);
            _didIteratorError4 = true;
            _iteratorError4 = _context4.t1;

          case 56:
            _context4.prev = 56;
            _context4.prev = 57;

            if (!_iteratorNormalCompletion4 && _iterator4.return != null) {
              _iterator4.return();
            }

          case 59:
            _context4.prev = 59;

            if (!_didIteratorError4) {
              _context4.next = 62;
              break;
            }

            throw _iteratorError4;

          case 62:
            return _context4.finish(59);

          case 63:
            return _context4.finish(56);

          case 64:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee2, this, [[3, 52, 56, 64], [15, 33, 37, 47], [38,, 42, 46], [57,, 59, 63]]);
  }));
  return _walkClassFiles.apply(this, arguments);
}

function walkClassFilesInJar(_x2) {
  return _walkClassFilesInJar.apply(this, arguments);
}

function _walkClassFilesInJar() {
  _walkClassFilesInJar = _wrapAsyncGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee3(jarFile) {
    var filesInsideZip, _iteratorNormalCompletion5, _didIteratorError5, _iteratorError5, _iterator5, _step5, _file2;

    return _regeneratorRuntime.wrap(function _callee3$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return _awaitAsyncGenerator(getFilesInsideZip(jarFile));

          case 2:
            filesInsideZip = _context5.sent;
            _iteratorNormalCompletion5 = true;
            _didIteratorError5 = false;
            _iteratorError5 = undefined;
            _context5.prev = 6;
            _iterator5 = _getIterator(filesInsideZip);

          case 8:
            if (_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done) {
              _context5.next = 16;
              break;
            }

            _file2 = _step5.value;

            if (!_file2.endsWith(".class")) {
              _context5.next = 13;
              break;
            }

            _context5.next = 13;
            return _file2;

          case 13:
            _iteratorNormalCompletion5 = true;
            _context5.next = 8;
            break;

          case 16:
            _context5.next = 22;
            break;

          case 18:
            _context5.prev = 18;
            _context5.t0 = _context5["catch"](6);
            _didIteratorError5 = true;
            _iteratorError5 = _context5.t0;

          case 22:
            _context5.prev = 22;
            _context5.prev = 23;

            if (!_iteratorNormalCompletion5 && _iterator5.return != null) {
              _iterator5.return();
            }

          case 25:
            _context5.prev = 25;

            if (!_didIteratorError5) {
              _context5.next = 28;
              break;
            }

            throw _iteratorError5;

          case 28:
            return _context5.finish(25);

          case 29:
            return _context5.finish(22);

          case 30:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee3, this, [[6, 18, 22, 30], [23,, 25, 29]]);
  }));
  return _walkClassFilesInJar.apply(this, arguments);
}

function getFilesInsideZip(zipFile) {
  return new _Promise(function (resolve, reject) {
    var zip = new StreamZip({
      file: zipFile,
      storeEntries: true,
      skipEntryNameValidation: true
    });
    zip.on('ready', function () {
      var entries = _Object$values(zip.entries()).filter(function (e) {
        return !e.isDirectory;
      }).map(function (e) {
        return e.name;
      });

      zip.close();
      resolve(entries);
    });
  });
}

module.exports =
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  _regeneratorRuntime.mark(function _callee(args) {
    var paths, classFilesByJar, _iteratorNormalCompletion3, _didIteratorError3, _iteratorError3, _iterator3, _step3, _value2, file, jarFile, classFile;

    return _regeneratorRuntime.wrap(function _callee$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            paths = args.map(function (arg) {
              return path.resolve(arg);
            }) // map path arguments to their absolute path
            .filter(function (elm, pos, arr) {
              return arr.indexOf(elm) == pos;
            }) // remove duplicate paths
            .filter(function (elm) {
              return fs.existsSync(elm);
            }) // remove non-existent paths
            .filter(function (elm, pos, arr) {
              return !arr.some(function (elm2, pos2) {
                return pos != pos2 && elm.startsWith(elm2);
              });
            }); // remove child paths

            classFilesByJar = {};
            _iteratorNormalCompletion3 = true;
            _didIteratorError3 = false;
            _context3.prev = 4;
            _iterator3 = _asyncIterator(walkClassFiles(walkPaths(paths)));

          case 6:
            _context3.next = 8;
            return _iterator3.next();

          case 8:
            _step3 = _context3.sent;
            _iteratorNormalCompletion3 = _step3.done;
            _context3.next = 12;
            return _step3.value;

          case 12:
            _value2 = _context3.sent;

            if (_iteratorNormalCompletion3) {
              _context3.next = 21;
              break;
            }

            file = _value2;
            jarFile = file.jarFile || '';
            classFile = file.classFile;
            if (!classFilesByJar[jarFile]) classFilesByJar[jarFile] = [classFile];else classFilesByJar[jarFile].push(classFile);

          case 18:
            _iteratorNormalCompletion3 = true;
            _context3.next = 6;
            break;

          case 21:
            _context3.next = 27;
            break;

          case 23:
            _context3.prev = 23;
            _context3.t0 = _context3["catch"](4);
            _didIteratorError3 = true;
            _iteratorError3 = _context3.t0;

          case 27:
            _context3.prev = 27;
            _context3.prev = 28;

            if (!(!_iteratorNormalCompletion3 && _iterator3.return != null)) {
              _context3.next = 32;
              break;
            }

            _context3.next = 32;
            return _iterator3.return();

          case 32:
            _context3.prev = 32;

            if (!_didIteratorError3) {
              _context3.next = 35;
              break;
            }

            throw _iteratorError3;

          case 35:
            return _context3.finish(32);

          case 36:
            return _context3.finish(27);

          case 37:
            return _context3.abrupt("return", classFilesByJar);

          case 38:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee, this, [[4, 23, 27, 37], [28,, 32, 36]]);
  }));

  return function (_x3) {
    return _ref.apply(this, arguments);
  };
}();
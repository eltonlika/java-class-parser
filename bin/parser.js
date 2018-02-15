"use strict";

var _getIterator = require("@babel/runtime/core-js/get-iterator");

var _Object$keys = require("@babel/runtime/core-js/object/keys");

var spawn = require('child_process').spawn;

var cmd = 'javap';
var accessModifier = '-private';
var typeRegex = '[a-zA-Z0-9\\.<>\\?\\$\\[\\]]+';
var classRegex = new RegExp('(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(class|interface) (' + typeRegex + ') (?:extends ((?:' + typeRegex + '),?)+ )?(?:implements ((?:[a-zA-Z0-9\\.<>\\?\\$ ])+,?)+ )?{([^}]+)}', 'gm');
var methodRegex = new RegExp('(?:(public|private|protected) )?((?:static|abstract|final) ?)*(?:(' + typeRegex + ') )?([a-zA-Z]+)\\(([^\\)]*)\\)');
var fieldRegex = new RegExp('(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(' + typeRegex + ') ([a-zA-Z0-9]+)');
var splitOutputRegex = new RegExp('Compiled from \"' + typeRegex + '\.java\"', 'gm');

module.exports = function (classFilesByJar, cb) {
  _Object$keys(classFilesByJar).forEach(function (jar) {
    var output = '';
    var error = '';
    var javapArgs = jar === '' ? [accessModifier].concat(classFilesByJar[jar]) : [accessModifier, '-classpath', jar].concat(classFilesByJar[jar].map(classFileToName));
    var child = spawn(cmd, javapArgs);
    child.stdout.on('data', function (data) {
      return output += '' + data;
    });
    child.stderr.on('data', function (data) {
      return error += '' + data;
    });
    child.on('close', function (code) {
      if (code !== 0) {
        var err = new Error(error);
        err.code = code;
        return cb(err);
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _getIterator(output.split(splitOutputRegex)), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _part = _step.value;
          // console.log('-------- START --------');
          // console.log(part);
          cb(null, outputParser(_part)); // console.log('-------- END --------');
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return != null) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });
  });
};

function outputParser(output) {
  var rs = {};
  var or = classRegex.exec(output);

  while (or) {
    var scope = or[1] || 'package';
    var describe = or[2];
    var type = or[3];
    var className = or[4];
    var exts = or[5];
    var impls = or[6];
    var classBody = or[7].split('\n').filter(Boolean).map(trimStr);
    var clz = {
      name: className,
      type: type,
      scope: scope,
      describe: (describe || '').trim(),
      'extends': exts ? exts.split(',').map(trimStr) : [],
      'implements': impls ? impls.split(',').map(trimStr) : [],
      constructors: [],
      fields: [],
      methods: []
    };
    classBody.forEach(function (member) {
      var signature = methodRegex.exec(member);

      if (!signature) {
        signature = fieldRegex.exec(member);

        if (signature) {
          var scope = signature[1] || 'package';
          var describe = (signature[2] || '').trim();
          var type = signature[3];
          var name = signature[4];
          clz.fields.push({
            name: name,
            scope: scope,
            type: type,
            describe: describe
          });
        }

        return;
      }

      var scope = signature[1] || 'package';
      var describe = (signature[2] || '').trim();
      var retVal = signature[3];
      var name = signature[4];
      var args = signature[5];

      if (retVal == undefined) {
        // no ret, constructor
        var cons = {
          scope: scope,
          name: name,
          describe: describe,
          args: args ? args.split(',').map(trimStr) : []
        };
        clz.constructors.push(cons);
      } else {
        var m = {
          scope: scope,
          describe: describe,
          ret: retVal,
          name: name,
          args: args ? args.split(',').map(trimStr) : []
        };
        clz.methods.push(m);
      }
    });
    rs[className] = clz; //console.log("START REGEX: last class " + className);

    or = classRegex.exec(output); //console.log("END REGEX");
  }

  return rs;
}

function trimStr(str) {
  return str.trim();
}

function classFileToName(classFile) {
  return classFile.replace(/\.class/g, "").replace(/\//g, ".");
}
#!/usr/bin/env node
"use strict";

var _JSON$stringify = require("@babel/runtime/core-js/json/stringify");

var walker = require('./walker');

var parser = require('./parser');

var argv = require('minimist')(process.argv.slice(2));

var paths = argv._;
var printer = argv['j'] || argv['json'] ? jsonPrinter : simplePrinter;
walker(paths).then(function (result) {
  return parser(result, printer);
});

function simplePrinter(err, rs) {
  if (err) return console.error(err.message);

  for (var clzName in rs) {
    var clz = rs[clzName];
    console.log('%s%s%s :', clzName, clz.extends.length ? ' extends ' + clz.extends.join(',') : '', clz.implements.length ? ' implements ' + clz.implements.join(',') : '');
    clz.constructors.forEach(function (cons) {
      console.log('\tconstructor: %s %s(%s)', cons.scope, cons.name, cons.args.join(','));
    });
    console.log('\tfields:');
    clz.fields.forEach(function (f) {
      console.log('\t\t%s %s %s', f.scope, f.type, f.name);
    });
    console.log('\tmethods:');
    clz.methods.forEach(function (method) {
      console.log('\t\t%s %s %s(%s)', method.scope, method.ret, method.name, method.args.join(','));
    });
    console.log();
  }
}

function jsonPrinter(err, rs) {
  if (err) return console.error(err.message);

  for (var clzName in rs) {
    console.log(_JSON$stringify(rs[clzName], null, 2));
  }
}
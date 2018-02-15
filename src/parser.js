"use strict"

const spawn = require('child_process').spawn;
const cmd = 'javap';
const accessModifier = '-private';

const typeRegex = '[a-zA-Z0-9\\.<>\\?\\$\\[\\]]+';
const classRegex = new RegExp('(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(class|interface) (' + typeRegex + ') (?:extends ((?:' + typeRegex + '),?)+ )?(?:implements ((?:[a-zA-Z0-9\\.<>\\?\\$ ])+,?)+ )?{([^}]+)}', 'gm');
const methodRegex = new RegExp('(?:(public|private|protected) )?((?:static|abstract|final) ?)*(?:(' + typeRegex + ') )?([a-zA-Z]+)\\(([^\\)]*)\\)');
const fieldRegex = new RegExp('(?:(public|private|protected) )?((?:(?:static|abstract|final) ?)*)(' + typeRegex + ') ([a-zA-Z0-9]+)');
const splitOutputRegex = new RegExp('Compiled from \"' + typeRegex + '\.java\"', 'gm');

module.exports = function(classFilesByJar, cb) {
    Object.keys(classFilesByJar).forEach(jar => {
        var output = '';
        var error = '';
        const javapArgs = (jar === '') ? [accessModifier].concat(classFilesByJar[jar]) : [accessModifier, '-classpath', jar].concat(classFilesByJar[jar].map(classFileToName));
        const child = spawn(cmd, javapArgs);
        child.stdout.on('data', data => output += '' + data);
        child.stderr.on('data', data => error += '' + data);
        child.on('close', code => {
            if (code !== 0) {
                const err = new Error(error);
                err.code = code;
                return cb(err);
            }
            for (const part of output.split(splitOutputRegex)) {
                // console.log('-------- START --------');
                // console.log(part);
                cb(null, outputParser(part));
                // console.log('-------- END --------');
            }

        });
    });
};

function outputParser(output) {
    const rs = {};
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

        classBody.forEach(function(member) {
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
            if (retVal == undefined) { // no ret, constructor
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

        rs[className] = clz;

        //console.log("START REGEX: last class " + className);
        or = classRegex.exec(output);
        //console.log("END REGEX");
    }

    return rs;
}

function trimStr(str) {
    return str.trim();
}

function classFileToName(classFile) {
    return classFile
        .replace(/\.class/g, "")
        .replace(/\//g, ".");
}
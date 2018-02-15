#!/usr/bin/env node

"use strict"

const fs = require('fs');
const path = require('path');
const StreamZip = require('node-stream-zip');

function* walkPath(p) {
    try {
        const stat = fs.statSync(p);
        if (stat.isDirectory())
            yield* walkPaths(fs.readdirSync(p).map(f => path.join(p, f)));
        else if (stat.isFile())
            yield p;
    } catch (err) {
        console.error(err.message);
    }
}

function* walkPaths(ps) {
    for (const p of ps)
        yield* walkPath(p);
}

async function* walkClassFiles(files) {
    for (const file of files) {
        if (file.endsWith(".class"))
            yield { classFile: file };
        else if (file.endsWith(".jar"))
            for await (const classFile of walkClassFilesInJar(file)) {
                yield { classFile: classFile, jarFile: file };
            }
    }
}

async function* walkClassFilesInJar(jarFile) {
    const filesInsideZip = await getFilesInsideZip(jarFile);
    for (const file of filesInsideZip)
        if (file.endsWith(".class"))
            yield file;
}

function getFilesInsideZip(zipFile) {
    return new Promise((resolve, reject) => {
        const zip = new StreamZip({ file: zipFile, storeEntries: true, skipEntryNameValidation: true });
        zip.on('ready', function() {
            const entries = Object.values(zip.entries()).filter(e => !e.isDirectory).map(e => e.name);
            zip.close();
            resolve(entries);
        });
    });
}

module.exports = async function(args) {
    const paths =
        args
        .map(arg => path.resolve(arg)) // map path arguments to their absolute path
        .filter((elm, pos, arr) => arr.indexOf(elm) == pos) // remove duplicate paths
        .filter(elm => fs.existsSync(elm)) // remove non-existent paths
        .filter((elm, pos, arr) => !arr.some((elm2, pos2) => pos != pos2 && elm.startsWith(elm2))); // remove child paths

    const classFilesByJar = {};

    for await (const file of walkClassFiles(walkPaths(paths))) {
        const jarFile = file.jarFile || '';
        const classFile = file.classFile;

        if (!classFilesByJar[jarFile])
            classFilesByJar[jarFile] = [classFile];
        else
            classFilesByJar[jarFile].push(classFile);
    }

    return classFilesByJar;
}
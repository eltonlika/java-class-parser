#!/usr/bin/env node

"use strict"

const StreamZip = require('node-stream-zip');
const path = require('path');
const fs = require('fs');
const args = require('minimist')(process.argv.slice(2));

const paths =
    args
    ._ // get all non-switch parameters
    .map(arg => path.resolve(arg)) // map path arguments to their absolute path
    .filter((elm, pos, arr) => arr.indexOf(elm) == pos) // remove duplicate paths
    .filter(elm => fs.existsSync(elm)) // remove non-existent paths
    .filter((elm, pos, arr) => !arr.some((elm2, pos2) => pos != pos2 && elm.startsWith(elm2))); // remove child paths

console.log(paths);

function* walkPath(p) {
    if (fs.statSync(p).isDirectory())
        yield* walkPaths(fs.readdirSync(p).map(f => path.join(p, f)));
    else
        yield p;
}

function* walkPaths(ps) {
    for (const p of ps)
        yield* walkPath(p);
}

async function* walkClassFiles(files) {
    for (const file of files) {
        if (file.endsWith(".class"))
            yield { 'type': 'class', 'path': file };
        else if (file.endsWith(".jar"))
            for await (const classFile of walkClassFilesInJar(file)) {
                yield { 'type': 'jar', 'path': classFile, 'jar': file };
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

async function main() {
    for await (const classFile of walkClassFiles(walkPaths(paths))) {
        console.log(classFile);
    }
}

main().catch(e => console.log(e));
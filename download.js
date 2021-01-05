#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const extract = require('extract-zip');
const args = process.argv;

if (!args[2]) {
    console.log("Usage: npx pereriksson/create-mithril-app-at-bth PROJECT_NAME");
    console.log("Exiting...");
    process.exit(0);
}

const absoluteArchivePath = path.resolve(__dirname, 'master.zip');
const absoluteFolderPath = path.resolve(__dirname, 'create-mithril-app-master');
const absoluteTargetPath = path.resolve(process.cwd(), args[2]);

const downloadRepo = async () => {
    const url = "https://codeload.github.com/pereriksson/create-mithril-app/zip/master";
    const res = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(absoluteArchivePath);
    res.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', (i) => {
            resolve();
        });
        writer.on('error', (i) => {
            reject();
        });
    })
}

const unzip = async () => {
    await extract(absoluteArchivePath, { dir: __dirname });
}

const remove = () => {
    fs.unlink(absoluteArchivePath, () => {});
    fs.rename(absoluteFolderPath, absoluteTargetPath, () => {});
}

const createProject = async() => {
    await downloadRepo();
    await unzip();
    remove();
}

createProject()
    .then(() => {
        console.log("Project has been created.")
    })
    .catch((e) => {
        console.log("An error occurred.")
    });
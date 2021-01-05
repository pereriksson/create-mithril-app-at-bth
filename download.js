#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const axios = require('axios');
const extract = require('extract-zip');
const args = process.argv;

const downloadRepo = async () => {
    const url = "https://codeload.github.com/pereriksson/create-mithril-app/zip/master";
    const res = await axios({
        url,
        method: 'GET',
        responseType: 'stream'
    });

    const p = path.resolve(__dirname, 'master.zip');
    const writer = fs.createWriteStream(p);
    res.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    })
}

const unzip = async () => {
    await extract("master.zip", { dir: __dirname });
}

const remove = () => {
    fs.unlink("master.zip", () => {});
    fs.rename("create-mithril-app-master", args[2], () => {});
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
        console.log("An error occured.")
        throw(e);
    });

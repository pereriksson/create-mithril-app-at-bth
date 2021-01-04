#!/usr/bin/env bash

URL="https://codeload.github.com/pereriksson/create-mithril-app/zip/master"

wget $URL -O master.zip

unzip "master.zip"

mv create-mithril-app-master $1
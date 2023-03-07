#!/bin/bash
dir="~/Documents/Arduino/server/data"
npm run build
rm -rf $dir*
mv ./dist/* $dir

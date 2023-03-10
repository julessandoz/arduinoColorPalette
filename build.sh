#!/bin/bash
dir="/Users/sebastientraber/Documents/Arduino/server/data"
npm run build
rm -rf $dir/*
mv ./dist/* $dir

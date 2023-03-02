#!/bin/bash
npm run build
rm -rf ~/Documents/Arduino/server/data/*
mv ./dist/* ~/Documents/Arduino/server/data

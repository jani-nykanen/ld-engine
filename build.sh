#!/bin/sh
if [ ! -d "dist" ]; then
    mkdir dist
fi
java -jar ./tools/compiler.jar --js src/*.js --js_output_file dist/out.js

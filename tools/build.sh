#!/bin/sh
cd "$(dirname "$0")"
if [ ! -d "dist" ]; then
    mkdir dist
fi
java -jar ./compiler.jar --js ../src/*.js --js_output_file ../dist/ld_engine.min.js

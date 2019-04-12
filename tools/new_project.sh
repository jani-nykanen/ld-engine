#!/bin/sh
cd "$(dirname "$0")"

# Check if enough parameters passed
if [ "$#" -ne 4 ]; then
    echo "Four parameters required."
    exit 1
fi

# Build engine
./build.sh

# Create the project folder
mkdir "../$1"
mkdir "../$1/lib"
mkdir "../$1/src"
mkdir "../$1/src/game"

# Create index file
./copy_index.py "$2" "$3" "$4" "../$1/index.html"

# Copy library files
cp ../lib/howler.min.js "../$1/lib/howler.min.js"
cp ../dist/ld_engine.min.js "../$1/lib/ld_engine.min.js"

# Copy template files
cp ../template/global.js "../$1/src/global.js"
cp ../template/main.js "../$1/src/main.js"
cp ../template/game/game.js "../$1/src/game/game.js"


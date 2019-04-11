#!/usr/bin/python

import sys

# Check if enough params
PARAM_COUNT = 4
if len(sys.argv) < PARAM_COUNT:
    print("Error! Need " + str(PARAM_COUNT) + " or more parameters!")
    sys.exit(1)

# Open file
file = open("./template/index.html", "r")

# Read content
content = file.read()

# Close file
file.close()

# Replace
content = content.replace("$TITLE", sys.argv[1])
content = content.replace("$CANVAS_WIDTH", sys.argv[2])
content = content.replace("$CANVAS_HEIGHT", sys.argv[3])

# Store result
file = open(sys.argv[4], "w")
file.write(content)
file.close()

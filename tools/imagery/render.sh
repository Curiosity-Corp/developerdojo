#!/bin/bash
# render.sh in.svg out.png W H [transparent]
f=$(readlink -f "$1")
google-chrome --headless=new --no-sandbox --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --default-background-color=00000000 --window-size=$3,$4 --screenshot="$(readlink -f "$2")" "file://$f" >/dev/null 2>&1

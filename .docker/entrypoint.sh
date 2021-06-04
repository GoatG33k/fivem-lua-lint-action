#!/bin/sh -l
LUACHECK_ARGS="--config /luacheck-fivem/.luacheckrc $1"
LUACHECK_PATH="$2"
EXIT_CODE=0
cd $GITHUB_WORKSPACE 

echo "exec => luacheck $LUACHECK_ARGS $LUACHECK_PATH"
luacheck $LUACHECK_ARGS $LUACHECK_PATH || EXIT_CODE=$?

echo "exit => $EXIT_CODE"
if [ $EXIT_CODE -ge 2 ]; then
 exit $EXIT_CODE
fi
 
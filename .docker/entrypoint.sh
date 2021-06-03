#!/bin/sh -l
LUACHECK_ARGS="--config /luacheck-fivem/.luacheckrc $1"
LUACHECK_PATH="$2"
PWD=$(pwd)

echo "exec => yarn"
cd /luacheck-fivem && yarn 

echo "exec => generate natives"
node -r ts-node/register ./generate-rc.ts && cd $PWD

echo "exec => luacheck $LUACHECK_ARGS $LUACHECK_PATH"
cd $GITHUB_WORKSPACE 

EXIT_CODE=0
luacheck $LUACHECK_ARGS $LUACHECK_PATH || EXIT_CODE=$?
echo "exit => $EXIT_CODE"
if [ $EXIT_CODE -le 1 ]
then
 exit 0
else
 exit $EXIT_CODE
fi
 
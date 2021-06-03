#!/bin/sh -l
LUACHECK_ARGS="--config /luacheck-fivem/.luacheckrc $1"
LUACHECK_PATH="$2"
PWD=$(pwd)

echo "exec => yarn"
cd /luacheck-fivem && yarn 

echo "exec => generate natives"
node -r ts-node/register ./generate-rc.ts && cd $PWD

cd $GITHUB_WORKSPACE
echo "exec => luacheck $LUACHECK_ARGS $LUACHECK_PATH"
echo "pwd => $(pwd)"
luacheck $LUACHECK_ARGS $LUACHECK_PATH
ls -al .
FROM evandarwin/lua:latest
RUN luarocks install argparse && \
    luarocks install luafilesystem && \
    luarocks install luacheck
RUN mkdir -p /luacheck-fivem
ADD . /luacheck-fivem/
RUN apk add --no-cache yarn nodejs && \
  chmod +x /luacheck-fivem/.docker/entrypoint.sh
  
ENTRYPOINT ["/luacheck-fivem/.docker/entrypoint.sh"]
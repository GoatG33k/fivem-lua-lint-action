# fivem-lua-lint-action

This GitHub Action runs `luacheck` on your Lua codebase for FiveM in any GitHub repository.

> Note: The FiveM Lua backtick syntax is **NOT** supported, please use `GetHashKey()` instead.

## Using

To use this in your GitHub repository, create the following file:

> **.github/workflows/lint.yml**

```yml
name: CI
on: [push, pull_request]
jobs:
  lint:
    name: Lint Lua Scripts
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2
      - name: Lint
        uses: GoatG33k/fivem-lua-lint-action@v1
```

This will automatically run `luacheck` for both commits and pull requests.

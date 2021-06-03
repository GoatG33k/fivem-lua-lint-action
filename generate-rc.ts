import fetch from "node-fetch"
import * as fs from "fs"
import * as path from "path"
import * as ansi from "ansi-colors"

interface CfxNative {
  name: string
  params: {
    name: string
    type: string
    description: string
  }[]
  results: "int" | "void" | "long" | "BOOL" | string
  description: string
  examples: {
    lang: "lua" | string
    code: string
  }[]
  hash: string
  ns: string
  aliases?: string[]
  apiset: "client" | "server" | "shared"
  game: "gta5" | "rdr3" | "ny"
}

type CfxNativesResponse = {
  [group: string]: { [native: string]: CfxNative }
}

const nativeOverrides: { [name: string]: string | undefined } = {
  GetGroundZFor3dCoord: "GetGroundZFor_3dCoord"
}

const macroCaseToSnake = (s: string): string => {
  const name = s
    .split("_")
    .map(str =>
      str
        .split("")
        .map((c, i) => (i === 0 ? c.toUpperCase() : c.toLowerCase()))
        .join("")
    )
    .join("")
  return nativeOverrides[name] || name;
}

const uniqueArray = <T>(a: T[]): T[] => {
  const b: T[] = []
  a.forEach(item => {
    if (b.includes(item)) return
    b.push(item)
  })
  return b
}

const reduceNativesToNames = (results: string[], item: CfxNative): string[] => {
  let name = item.name || `N_${item.hash}`
  name = macroCaseToSnake(name)
  results.push(name)
  ;(item.aliases || []).forEach(a => {
    if (a.slice(0, 1) === "_") {
      let aliasName = macroCaseToSnake(a.slice(1))
      if (aliasName === "GetGroundZFor3dCoord") {
        aliasName = "GetGroundZFor_3dCoord"
      }
      results.push(aliasName)
    }
  })
  return results
}

interface MappedNativeResponse {
  shared: string[]
  client: string[]
  server: string[]
}

async function fetchAllNatives(): Promise<MappedNativeResponse> {
  const clientNatives: string[] = []
  const serverNatives: string[] = []
  const sharedNatives: string[] = []
  const urls = [
    "https://runtime.fivem.net/doc/natives_cfx.json",
    "https://runtime.fivem.net/doc/natives.json"
  ]

  for (const url of urls) {
    console.log(ansi.cyan(`fetch => ${ansi.blueBright(url)}...`))
    await fetch(url)
      .then<CfxNativesResponse>(r => r.json())
      .then(data => {
        const nativesList: CfxNative[] = Object.entries(data)
          .reduce((natives: CfxNative[], [_, list]) => {
            natives.push(...Object.values(list))
            return natives
          }, [])
          .filter(n => !!n.name)

        clientNatives.push(
          ...nativesList
            .filter(n => !n.apiset || n.apiset === "client")
            .reduce(reduceNativesToNames, [])
        )
        serverNatives.push(
          ...nativesList
            .filter(n => n.apiset === "server")
            .reduce(reduceNativesToNames, [])
        )
        sharedNatives.push(
          ...nativesList
            .filter(n => n.apiset === "shared")
            .reduce(reduceNativesToNames, [])
        )
      })
  }

  return {
    shared: uniqueArray(sharedNatives),
    client: uniqueArray(clientNatives),
    server: uniqueArray(serverNatives)
  }
}

fetchAllNatives().then(natives => {
  let template = fs.readFileSync(
    path.join(__dirname, ".luacheckrc.template"),
    "utf-8"
  )
  template = template
    .replace("%%SHARED_GLOBALS%%", natives.shared.map(s => `'${s}'`).join(", "))
    .replace("%%SERVER_GLOBALS%%", natives.server.map(s => `'${s}'`).join(", "))
    .replace("%%CLIENT_GLOBALS%%", natives.client.map(s => `'${s}'`).join(", "))
  fs.writeFileSync(path.join(__dirname, ".luacheckrc"), template)
  console.log(ansi.gray(`=`.repeat(29)))
  console.log(
    ansi.gray(
      `=== ${ansi.yellow(
        natives.shared.length.toString()
      )} ${ansi.magentaBright("shared")} generated`.padEnd(45, " ") + " ==="
    )
  )
  console.log(
    ansi.gray(
      `=== ${ansi.blue(natives.server.length.toString())} ${ansi.magentaBright(
        "server"
      )} generated`.padEnd(45, " ") + " ==="
    )
  )
  console.log(
    ansi.gray(
      `=== ${ansi.green(natives.client.length.toString())} ${ansi.magentaBright(
        "client"
      )} generated`.padEnd(45, " ") + " ==="
    )
  )
  console.log(ansi.gray(`========[ ${ansi.greenBright("COMPLETED")} ]========`))
})

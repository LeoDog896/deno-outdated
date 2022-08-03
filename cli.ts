import { Command } from "https://deno.land/x/cliffy@v0.24.2/command/mod.ts";
import { findAndReplace } from "./change.ts";

await new Command()
  .name("deno-outdated")
  .version("0.0.1")
  .description(
    "Check for outdated dependencies for deno.land/x and other various 3rd party vendors",
  )
  .action(async () => {
    for await (const file of Deno.readDir(Deno.cwd())) {

      if (!file.isFile) return

      await Deno.writeTextFile(file.name, await findAndReplace(await Deno.readTextFile(file.name)))
    }
  })
  .parse(Deno.args);

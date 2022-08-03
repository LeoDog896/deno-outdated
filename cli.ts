import { Command } from "https://deno.land/x/cliffy@v0.24.3/command/mod.ts";
import { findAndReplace } from "./change.ts";

await new Command()
  .name("deno-outdated")
  .version("0.0.1")
  .option("-q --quiet", "Silence any output", {
    default: false,
  })
  .option("-i --ignore [ignore:string[]]", "list of files to ignore", {
    separator: " "
  })
  .description(
    "Check for outdated dependencies for deno.land/x and other various 3rd party vendors",
  )
  .action(async ({ quiet, ignore }) => {
    let count = 0;
    for await (const file of Deno.readDir(Deno.cwd())) {
      if (!file.isFile) continue;
      if (Array.isArray(ignore) && ignore.includes(file.name)) continue;

      const originalSource = await Deno.readTextFile(file.name);
      const newSource = await findAndReplace(originalSource);

      if (newSource !== originalSource) {
        await Deno.writeTextFile(
          file.name,
          newSource,
        );

        count++;

        if (!quiet) console.log(file.name);
      }
    }

    if (!quiet) console.log(`Updated ${count} files.`);
  })
  .parse(Deno.args);

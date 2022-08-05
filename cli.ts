import { Command } from "https://deno.land/x/cliffy@v0.24.3/command/mod.ts";
import { findAndReplace } from "./change.ts";

async function update(quiet: boolean, ignore: string[], dir = Deno.cwd()) {
  let count = 0;
  for await (const file of Deno.readDir(dir)) {
    if (file.isDirectory) {
      count += await update(quiet, ignore, file.name)
    }
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

  return count
}

await new Command()
  .name("deno-outdated")
  .version("0.0.1")
  .option("-q --quiet", "Silence any output", {
    default: false,
  })
  .option("-i --ignore [ignore:string[]]", "list of files to ignore", {
    separator: " ",
  })
  .description(
    "Check for outdated dependencies for deno.land/x and other various 3rd party vendors",
  )
  .action(async ({ quiet, ignore }) => {
    // cast ignore to string[]. Checks for boolean and null
    const count = await update(quiet, ignore ? [] : ignore ?? [], Deno.cwd())
    if (!quiet) console.log(`Updated ${count} files.`);
  })
  .parse(Deno.args);

import { Command } from "https://deno.land/x/cliffy@v0.24.3/command/mod.ts";
import { recursiveReaddir } from "https://deno.land/x/recursive_readdir@v2.0.0/mod.ts";
import { basename } from "https://deno.land/std@0.151.0/path/mod.ts";
import { findAndReplace } from "./change.ts";

async function update(quiet: boolean, ignore: string[]) {
  let count = 0;
  const files = await recursiveReaddir(Deno.cwd())
  for (const file of files) {
    // .gitignore and .git
    if (basename(file) == ".git") continue

    if (Array.isArray(ignore) && ignore.includes(basename(file))) continue;

    const originalSource = await Deno.readTextFile(file);
    const newSource = await findAndReplace(originalSource);

    if (newSource !== originalSource) {
      await Deno.writeTextFile(
        file,
        newSource,
      );

      count++;

      if (!quiet) console.log(file);
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
    const count = await update(quiet, ignore ? [] : ignore ?? [])
    if (!quiet) console.log(`Updated ${count} files.`);
  })
  .parse(Deno.args);

import { Command } from "https://deno.land/x/cliffy@v0.24.3/command/mod.ts";
import { basename, join } from "https://deno.land/std@0.152.0/path/mod.ts";
import { findAndReplace } from "./change.ts";

export async function* recursiveReaddir(
  path: string,
  ignore: string[] = [],
): AsyncGenerator<string, void> {
  for await (const dirEntry of Deno.readDir(path)) {
    if (ignore.includes(dirEntry.name)) continue;

    if (dirEntry.isDirectory) {
      yield* recursiveReaddir(join(path, dirEntry.name), ignore);
    } else if (dirEntry.isFile) {
      yield join(path, dirEntry.name);
    }
  }
}

async function update(
  quiet: boolean,
  check: boolean,
  ignore: string[] = [],
  lineIgnore: string,
  debug = false,
) {
  let count = 0;
  // TODO .gitignore
  for await (const file of recursiveReaddir(Deno.cwd(), [...ignore, ".git"])) {
    if (debug) console.log(`Scanning ${file}`);

    if (ignore.includes(basename(file))) {
      if (debug) console.log(`Ignoring ${file}`);
      continue;
    }

    if (debug) console.log(`Attempting to update ${file}`);
    const originalSource = await Deno.readTextFile(file);
    const newSource = await findAndReplace(originalSource, lineIgnore);

    if (newSource !== originalSource) {
      if (check) {
        console.log(`${file} needs updating`);
      } else {
        await Deno.writeTextFile(
          file,
          newSource,
        );
      }

      count++;

      if (!quiet) console.log(file);
    }
  }

  return count;
}

await new Command()
  .name("deno-outdated")
  .version("0.0.1")
  .option("-d --debug", "Show all scanned files", {
    default: false,
  })
  .option("-q --quiet", "Silence any output", {
    default: false,
  })
  .option("-i --ignore [ignore:string[]]", "list of files to ignore", {
    separator: " ",
  })
  .option(
    "-l --line-ignore [line-ignore:string]",
    "The text of the comment to ignore",
    {
      default: "i-deno-outdated",
    },
  )
  .option(
    "-c --check",
    "True if the editor shouldn't change files and tell you about outdated dependencies.",
    {
      default: false,
    },
  )
  .description(
    "Check for outdated dependencies for deno.land/x and other various 3rd party vendors",
  )
  .action(async ({ quiet, ignore, lineIgnore, debug, check }) => {
    const count = await update(
      quiet,
      check,
      Array.isArray(ignore) ? ignore : [],
      typeof lineIgnore === "string" ? lineIgnore : "i-deno-outdated",
      debug,
    );
    if (!quiet) console.log(`Updated ${count} file${count === 1 ? "" : "s"}`);
  })
  .parse(Deno.args);

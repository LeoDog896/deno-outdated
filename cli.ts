import { Command } from "https://deno.land/x/cliffy@v0.25.7/command/mod.ts";
import { basename, join } from "https://deno.land/std@0.177.1/path/mod.ts";
import { findAndReplace } from "./change.ts";

/**
 * Recursively find all files in a directory
 * @param path The starting parent path
 * @param ignore The files to ignore
 */
export async function* recursiveReaddir(
  path = Deno.cwd(),
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
  quiet = false,
  check = false,
  ignore: string[] = [],
  lineIgnore = "i-deno-outdated",
  debug = false,
) {
  let count = 0;
  // TODO .gitignore
  for await (
    const file of recursiveReaddir(Deno.cwd(), [...ignore, ".git", "deno.lock"])
  ) {
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
  .version("0.3.0")
  .option("-d, --debug", "Show all scanned files")
  .option("-q, --quiet", "Silence any output")
  .option(
    "-c, --check",
    "Check files without updating them",
  )
  .option(
    "-l --line-ignore [line-ignore:string]",
    "The text of the comment to ignore",
    {
      default: "i-deno-outdated",
    },
  )
  .option("-i --ignore [ignore...:string]]", "list of files to ignore", {
    separator: " ",
  })
  .description(
    "Check and update outdated dependencies for various 3rd party vendors",
  )
  .action(async ({ quiet, ignore, lineIgnore, debug, check }) => {
    const count = await update(
      quiet,
      check,
      Array.isArray(ignore) ? ignore : [],
      typeof lineIgnore === "string" ? lineIgnore : "i-deno-outdated",
      debug,
    );
    if (!quiet) {
      console.log(
        `${check ? "Checked" : "Updated"} ${count} file${
          count === 1 ? "" : "s"
        }`,
      );
    }
  })
  .parse(Deno.args);

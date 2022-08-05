import { Command } from "https://deno.land/x/cliffy@v0.24.3/command/mod.ts";
import { basename, join } from "https://deno.land/std@0.151.0/path/mod.ts";
import { findAndReplace } from "./change.ts";

export async function recursiveReaddir(path: string, ignore: string[]) {
  const files: string[] = [];
  const getFiles = async (path: string) => {
    for await (const dirEntry of Deno.readDir(path)) {
      if (ignore.includes(dirEntry.name)) continue;
      if (dirEntry.isDirectory) {
        await getFiles(join(path, dirEntry.name));
      } else if (dirEntry.isFile) {
        files.push(join(path, dirEntry.name));
      }
    }
  };
  await getFiles(path);
  return files;
}

async function update(quiet: boolean, ignore: string[] = []) {
  let count = 0;
  // TODO .gitignore
  const files = await recursiveReaddir(Deno.cwd(), [...ignore, ".git"])
  for (const file of files) {
    if (ignore.includes(basename(file))) continue;
    
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
    const count = await update(quiet, Array.isArray(ignore) ? ignore : [])
    if (!quiet) console.log(`Updated ${count} files.`);
  })
  .parse(Deno.args);

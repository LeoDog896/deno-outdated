import { Command } from "https://deno.land/x/cliffy@v0.24.3/command/mod.ts%22";
import { findAndReplace } from "./change.ts";

await new Command()
  .name("deno-outdated")
  .version("0.0.1")
  .description(
    "Check for outdated dependencies for deno.land/x and other various 3rd party vendors",
  )
  .action(async () => {
    let count = 0;
    for await (const file of Deno.readDir(Deno.cwd())) {
      if (!file.isFile) continue;

      const originalSource = await Deno.readTextFile(file.name);
      const newSource = await findAndReplace(originalSource);

      if (newSource !== originalSource) {
        await Deno.writeTextFile(
          file.name,
          newSource,
        );

        count++;

        console.log(file.name);
      }
    }

    console.log(`Updated ${count} files.`);
  })
  .parse(Deno.args);

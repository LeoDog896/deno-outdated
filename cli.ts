import { Command } from "https://deno.land/x/cliffy@v0.24.2/command/mod.ts";

await new Command()
  .name("deno-outdated")
  .version("0.0.1")
  .description(
    "Check for outdated dependencies for deno.land/x and other various 3rd party vendors",
  )
  .action(() => {
    console.log("Hello World!");
  })
  .parse(Deno.args);

import { regexes } from "./regex.ts";
import { updateOrSelf } from "./update.ts";
import replaceAsync from "https://esm.sh/string-replace-async@3.0.2";

export async function findAndReplace(source: string): Promise<string> {
  const lines = await Promise.all(
    source.split("\n").map(str =>
      regexes.reduce(
        async (prev, regex) => {
          const newPrev = await prev;
          if (newPrev.includes("i-deno-outdated")) {
            return newPrev;
          }
          return replaceAsync(
            newPrev,
            regex.validate,
            updateOrSelf,
          );
        },
        Promise.resolve(str),
      )
    ),
  );
  return lines.join("\n");
}

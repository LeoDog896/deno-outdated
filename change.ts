import { Regex, regexes } from "./regex.ts";
import { updateOrSelf } from "./update.ts";
import replaceAsync from "https://esm.sh/string-replace-async@3.0.2";

export async function findAndReplace(source: string): Promise<string> {
  const regexValues = (Object.values(regexes).filter((regex) =>
    regex !== undefined
  ) as Regex[])

  const lines = await Promise.all(source.split("\n").map(str => {
    return regexValues.reduce(
      async (prev, regex) => {
        if ((await prev).includes("i-deno-outdated")) {
          return await prev;
        }
        return replaceAsync(
          await prev,
          regex.validate,
          url => updateOrSelf(url),
        );
      },
      Promise.resolve(str),
    );
  }))

  return lines.join("\n")
}

import { Regex, regexes } from "./regex.ts";
import { updateOrSelf } from "./update.ts";
import replaceAsync from "https://esm.sh/string-replace-async@3.0.2";

export function findAndReplace(source: string): Promise<string> {
  return (Object.values(regexes).filter(regex =>
    regex !== undefined
  ) as Regex[]).reduce(
    async (prev, regex) =>
      replaceAsync(
        await prev,
        regex.validate,
        url => updateOrSelf(url),
      ),
    Promise.resolve(source),
  );
}

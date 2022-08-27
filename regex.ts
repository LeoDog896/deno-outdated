export interface Regex {
  validate: RegExp;
  removal: RegExp;
}

/*
 TODO all of the regexes currently follow:

 Match: /https\?:\\\/\\\/([\w.]+)\\\/\[\^ "'`\]\+\/g
 Replace: "$1"

 All cases follow similar of not exactly the same removal case. When more regexes are added, if they all follow this pattern, it may be possible to easily update new registries that follow this.
*/
export const regexes: Regex[] = [
  {
    validate: /https?:\/\/deno.land\/[^ "'`]+/g,
    removal: /@[\w\d+\.]+/g,
  },
  {
    validate: /https?:\/\/esm.sh\/[^ "'`]+/g,
    removal: /@[\d\.]+/g,
  },
  {
    validate: /https?:\/\/cdn.jsdelivr.net\/[^ "'`]+/g,
    removal: /@[\d\.]+/g,
  },
  {
    validate: /https?:\/\/unpkg.com\/[^ "'`]+/g,
    removal: /@[\w\d+\.]+/g,
  },
];

/**
 * Applies a URL regex to a URL. Finds the first match of the validate regexp and removes any matches of the removal regexp.
 * @param url The URL to apply it on
 */
export function apply(url: string): string | undefined {
  for (const regex of regexes) {
    if (regex && regex.validate.test(url)) {
      return url.replace(regex.removal, "");
    }
  }

  return undefined;
}

export interface Regex {
  validate: RegExp;
  removal: RegExp;
}

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

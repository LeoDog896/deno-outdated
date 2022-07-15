interface Regex {
  validate: RegExp;
  removal: RegExp;
}

export const regexes: { [key: string]: Regex | undefined } = {
  deno: {
    validate: /https?:\/\/deno.land\/x\/[^ ]+/g,
    removal: /@v[\d+\.]+/g
  },
  esm: {
    validate: /https?:\/\/esm.sh\/[^ ]+/g,
    removal: /@[\d\.]+/g
  },
  jsdelivr: {
    validate: /https?:\/\/cdn.jsdelivr.net\/[^ ]+/g,
    removal: /@[\d\.]+/g
  }
} as const;


/**
 * Applies a URL regex to a URL. Finds the first match of the validate regexp and removes any matches of the removal regexp.
 * @param url The URL to apply it on
 */
export function apply(url: string): string | undefined {
  for (const regex of Object.values(regexes)) {
    if (regex && regex.validate.test(url)) {
      return url.replace(regex.removal, "")
    }
  }

  return undefined
}
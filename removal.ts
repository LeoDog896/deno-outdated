interface Removal {
  validate: RegExp;
  removal: RegExp;
}

export const removals: { [key: string]: Removal | undefined } = {
  deno: {
    validate: /^https?:\/\/deno.land\/x\//g,
    removal: /@v[\d+\.]+/g
  },
  esm: {
    validate: /^https?:\/\/esm\.sh\//g,
    removal: /@[\d\.]+/g
  },
  jsdelivr: {
    validate: /^https?:\/\/cdn.jsdelivr.net/g,
    removal: /@[\d\.]+/g
  }
} as const;


/**
 * Applies a removal to a URL. Finds the first match of the validate regexp and removes any matches of the removal regexp.
 * @param url The URL to apply it on
 */
export function applyRemoval(url: string): string | undefined {
  for (const [_, removal] of Object.entries(removals)) {
    if (removal && removal.validate.test(url)) {
      return url.replace(removal.removal, "")
    }
  }

  return undefined
}
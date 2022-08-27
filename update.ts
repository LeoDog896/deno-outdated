import { apply } from "./regex.ts";
import { checkRedirect } from "./redirect.ts";

/**
 * Removes any versioning from a URL and finds the latest redirect for it
 * @param url The URL to check against
 * @returns The updated URL or undefined if it wasn't updated.
 */
export async function update(url: string): Promise<string | undefined> {
  return (await checkRedirect(apply(url) ?? url));
}

/**
 * Removes any versioning from a URL and finds the latest redirect for it
 * @param url The URL to check against
 * @returns The url whether it was updated or not.
 */
export async function updateOrSelf(url: string): Promise<string> {
  return await update(url) ?? url;
}

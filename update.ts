import { apply } from "./regex.ts";
import { checkRedirect } from "./redirect.ts";

export async function updateOrSelf(url: string): Promise<string> {
  return (await checkRedirect(apply(url) ?? url)) ?? url;
}

export async function update(url: string): Promise<string | undefined> {
  return (await checkRedirect(apply(url) ?? url)) ?? undefined;
}

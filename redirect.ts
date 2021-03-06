/**
 * Find the redirect of a URL, or `null` if no redirect exists.
 * @param url the URL
 */
export async function checkRedirect(url: string): Promise<string | undefined> {
  const response = await fetch(url)

  await response.body?.cancel()

  if (response.redirected) {
    return response.url
  } else {
    return undefined
  }
}
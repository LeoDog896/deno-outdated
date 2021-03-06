import { checkRedirect } from "../redirect.ts"
import { assertNotEquals, assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";

Deno.test("Redirects redirect to another URL (against deno.land/x)", async () => {
  const redirect = await checkRedirect("https://deno.land/x/cliffy/mod.ts")

  assertNotEquals(redirect, undefined)
})

Deno.test("Redirects don't redirect to another URL (against deno.land/x)", async () => {
  const redirect = await checkRedirect("https://deno.land/x/cliffy@v0.24.2/mod.ts?code")

  assertEquals(redirect, undefined)
})
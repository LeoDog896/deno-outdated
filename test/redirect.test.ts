import { checkRedirect } from "../redirect.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.177.1/testing/asserts.ts";

Deno.test("Redirects redirect to another URL (against deno.land/x)", async () => {
  const redirect = await checkRedirect("https://deno.land/x/cliffy/mod.ts"); // i-deno-outdated

  assertNotEquals(redirect, undefined);
});

Deno.test("Redirects don't redirect to another URL (against deno.land/x)", async () => {
  const redirect = await checkRedirect(
    "https://deno.land/x/cliffy@v0.24.2/mod.ts?code", // i-deno-outdated
  );

  assertEquals(redirect, undefined);
});

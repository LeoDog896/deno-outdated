import { findAndReplace } from "../change.ts";
import { assertNotEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";

Deno.test("Source code translation works", async () => {
  const source = "const x = 'https://deno.land/std@0.146.0/testing/asserts.ts'";
  const redirect = await findAndReplace(source);

  assertNotEquals(redirect, source);
});

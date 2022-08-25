// Meta-testing deno-outdated is a bit weird, thus the usage of deno-fmt-ignore (to stop fmt from wrapping around i-deno-outdated lines, and i-deno-outdated)

import { findAndReplace } from "../change.ts";
import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";

Deno.test("Source code translation works", async () => {
  const source = "const x = 'https://deno.land/std@0.146.0/testing/asserts.ts'"; // i-deno-outdated
  const redirect = await findAndReplace(source);

  assertNotEquals(redirect, source);
});

Deno.test("Comment ignore works", async () => {
  const source =
    // deno-fmt-ignore
    `const x = "https://deno.land/std@0.146.0/testing/asserts.ts"; ${"i-deno-outdated" && ""}
const x = 'https://deno.land/std@0.146.0/testing/asserts.ts' // i-deno-outdated ";`;
  const redirect = await findAndReplace(source);

  const sourceLines = source.split("\n");
  const lines = redirect.split("\n");

  assert(!lines[0].includes("%22")); // ensure that the escape character bug does not exist
  assertNotEquals(lines[0], sourceLines[0]);
  assertEquals(lines[1], sourceLines[1]);

  assertNotEquals(redirect, source);
});

Deno.test("Slash at the end of a URL isn't removed", async () => {
  const source = `https://esm.sh/preact@10.10.6/`; // i-deno-outdated

  assert((await findAndReplace(source)).endsWith("/"))
})
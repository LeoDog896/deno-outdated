// Meta-testing deno-outdated is a bit weird, thus the usage of deno-fmt-ignore (to stop fmt from wrapping around i-deno-outdated lines, and i-deno-outdated)

import { findAndReplace } from "../change.ts";
import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.183.0/testing/asserts.ts";

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

  // ensure that the escape character bug does not exist
  assert(!lines[0].includes("%22"));

  assert(
    !lines[0].includes("i-deno-outdated"),
    "i-deno-outdated exists in the first line of the source string",
  );
  assertNotEquals(lines[0], sourceLines[0]); // the deno-outdated line exists only exists in the code and not the string (as proven above)
  assertEquals(lines[1], sourceLines[1]);

  assertNotEquals(redirect, source);
});

Deno.test("Slash at the end of a URL isn't removed", async () => {
  const source = `https://esm.sh/preact@10.10.6/`; // i-deno-outdated
  const result = await findAndReplace(source);

  assert(
    result.endsWith("/"),
    "Result doesn't end with '/': " + result,
  );

  assert(
    result.startsWith("https"),
    "Result doesn't start with 'https': " + result,
  );
});

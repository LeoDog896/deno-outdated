import { findAndReplace } from "../change.ts";
import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.148.0/testing/asserts.ts";

Deno.test("Source code translation works", async () => {
  const source = "const x = 'https://deno.land/std@0.146.0/testing/asserts.ts'"; // i-deno-outdated
  const redirect = await findAndReplace(source);

  assertNotEquals(redirect, source);
});

Deno.test("Comment ignore works", async () => {
  const source =
    `const x = 'https://deno.land/std@0.146.0/testing/asserts.ts'; ${
      "i-deno-outdated" && ""
    }
const x = 'https://deno.land/std@0.146.0/testing/asserts.ts' // i-deno-outdated ";`;
  const redirect = await findAndReplace(source);

  const sourceLines = source.split("\n");
  const lines = redirect.split("\n");

  assertNotEquals(lines[0], sourceLines[0]);
  assertEquals(lines[1], sourceLines[1]);

  assertNotEquals(redirect, source);
});

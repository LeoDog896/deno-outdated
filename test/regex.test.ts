import { apply } from "../regex.ts";
import { assertEquals } from "https://deno.land/std@0.177.1/testing/asserts.ts";

Deno.test("Removal works (deno.land/x)", () => {
  const url = "https://deno.land/x/cliffy@v0.25.7/mod.ts";

  assertEquals(apply(url), "https://deno.land/x/cliffy/mod.ts"); // i-deno-outdated
});

Deno.test("Removal works (esm.sh)", () => {
  const url = "https://esm.sh/react@18.2.0";

  assertEquals(apply(url), "https://esm.sh/react"); // i-deno-outdated
});

Deno.test("Removal works (cdn.jsdelivr.net)", () => {
  const url = "https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js";

  assertEquals(
    apply(url),
    "https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js", // i-deno-outdated
  );
});

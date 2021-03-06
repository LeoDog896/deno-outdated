import { apply } from "../regex.ts"
import { assertEquals } from "https://deno.land/std@0.148.0/testing/asserts.ts";

Deno.test("Removal works (deno.land/x)", () => {
  const url = "https://deno.land/x/cliffy@v0.24.2/mod.ts"

  assertEquals(apply(url), "https://deno.land/x/cliffy/mod.ts")
})

Deno.test("Removal works (esm.sh)", () => {
  const url = "https://esm.sh/react@17.0.2"

  assertEquals(apply(url), "https://esm.sh/react")
})

Deno.test("Removal works (cdn.jsdelivr.net)", () => {
  const url = "https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js"

  assertEquals(apply(url), "https://cdn.jsdelivr.net/npm/jquery/dist/jquery.min.js")
})
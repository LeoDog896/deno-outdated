# deno-outdated

Scans & updates your project at an entry point for outdated deno dependencies.
This will not update non-pinned dependencies (dependencies without any version
specified)

You can ignore updating for a line with `i-deno-outdated`, for example:

<!-- deno-fmt-ignore -->
```ts
const source = `
const x = 'https://deno.land/std@0.146.0/testing/asserts.ts'; ${"i-deno-outdated" && ""} 
const x = 'https://deno.land/std@0.146.0/testing/asserts.ts' // i-deno-outdated ";
`;
```

Currently works with:

- https://deno.land/x
- https://esm.sh/
- https://cdn.jsdelivr.net

## Internal layout

Updating works by finding URLs in a source file, removing their version
specifier, and redirecting it to the latest one.

This is split into different stacking modules:

### Layer 1:

- Redirect (`redirect.ts`) finds any simple redirects in that URL.
- Removal (`removal.ts`) removes the version part of a URL. This is dependent on
  the vendor (deno.land/x, esm.sh).

### Layer 2: (`update.ts`)

This updates a URL to its latest known version, if any.

### Layer 3 (`change.ts`)

This is the API for the CLI app, and it allows you to scan files for outdated
dependencies and update them.

### Layer 4 (`cli.ts`)

This wraps everything around with cliffy for a nice CLI app.

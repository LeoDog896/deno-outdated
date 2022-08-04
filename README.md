# deno-outdated
[![Open in Gitpod](https://gitpod.io/button/open-in-gitpod.svg)](https://gitpod.io/#https://github.com/LeoDog896/deno-outdated)

```bash
deno install --allow-read=./ --allow-net --allow-write=./ -f -n=deno-outdated https://deno.land/x/deno-outdated/cli.ts
```

Or, add it to your deno.json's tasks:

```json
"update": "deno run --allow-read=./ --allow-net --allow-write=./ https://deno.land/x/deno-outdated/cli.ts --ignore README.md",
```

Scans & updates your project for outdated deno dependencies.
This will not update non-pinned dependencies (dependencies without any version
specified)

## Flags

- `-q, --quiet`: Ignore any output of the file
- `-i, --ignore [files...]`: Ignore certain files for formatting

## Ignore

You can ignore updating for a line with `i-deno-outdated`, for example:

<!-- deno-fmt-ignore -->
```ts
import { assert } from "https://deno.land/std@0.146.0/testing/asserts.ts" // i-deno-outdated

const source = `
const x = 'https://deno.land/std@0.146.0/testing/asserts.ts'; ${"i-deno-outdated" && ""} 
const x = 'https://deno.land/std@0.146.0/testing/asserts.ts' // i-deno-outdated ";
`;
````

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

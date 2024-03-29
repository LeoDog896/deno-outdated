# deno-outdated

Pins your dependencies to the latest version & updates existing ones.

```bash
deno install --allow-read=./ --allow-net --allow-write=./ -f -n=deno-outdated https://deno.land/x/deno_outdated/cli.ts
```

Or, add it to your deno.json's (or deno.jsonc) tasks:

```json
"update": "deno run --allow-read=./ --allow-net --allow-write=./ https://deno.land/x/deno_outdated/cli.ts",
```

You can even add a github action:
https://github.com/LeoDog896/deno-outdated/blob/main/.github/workflows/update.yml

Do note that if you're running an application, remove the run action that
removes deno.lock `rm deno.lock`, as that is only for libraries

## Flags

- `-q, --quiet`: Silence CLI output
- `-d, --debug`: Add extra information to see scanning
- `-i, --ignore [files...]`: Ignore certain files for formatting
- `-c, --check`: Check files for outdated dependencies without updating them

## Ignore

You can ignore updating for a line with `i-deno-outdated`, for example:

<!-- deno-fmt-ignore -->
```ts
import { assert } from "https://deno.land/std@0.146.0/testing/asserts.ts" // i-deno-outdated

const source = `
const x = 'https://deno.land/std@0.146.0/testing/asserts.ts'; ${"i-deno-outdated" && ""} 
const x = 'https://deno.land/std@0.146.0/testing/asserts.ts' // i-deno-outdated ";
`;
```

Currently works with:

- https://deno.land/
- https://esm.sh/
- https://cdn.jsdelivr.net
- https://unpkg.com

(Want to add more? Contribute to `regex.ts`)

## What's the difference between this and [UDD](https://github.com/hayd/deno-udd)?

This tool aims to be similar to deno native tools such as `deno fmt` and
`deno lint`, or aka shellable

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

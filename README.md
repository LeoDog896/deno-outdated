# deno-outdated

Scans your project at an entry point for outdated deno dependencies.

Currently works with:

- https://deno.land/x
- https://esm.sh/

## Internal layout

This is split into different stacking modules:

### Layer 1:
- Redirect (`redirect.ts`) finds any simple redirects in that URL.
- Removal (`removal.ts`) removes the version part of a URL. This is dependent on the vendor (deno.land/x, esm.sh).

### Layer 2: (`update.ts`)

This updates a URL to its latest known version, if any.

### Layer 3 (`change.ts`)

This is the API for the CLI app, and it allows you to scan files for outdated dependencies and optionally update them.

### Layer 4 (`cli.ts`)

This wraps everything around with cliffy for a nice CLI app.
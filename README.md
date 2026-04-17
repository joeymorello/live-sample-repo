# Strudel Samples

Personal sample pack for [Strudel](https://strudel.cc) live coding.

## Structure

```
.
├── strudel.json              # manifest Strudel reads
├── generate-strudel-json.mjs # rescans samples/ and rewrites manifest
└── samples/
    ├── bd/    bass drums
    ├── sd/    snares
    ├── hh/    closed hats
    ├── oh/    open hats
    ├── cp/    claps
    ├── perc/  percussion
    ├── bass/  basses
    ├── pad/   pads
    ├── lead/  leads / synths
    ├── fx/    one-shots, risers, impacts
    └── vox/   vocals
```

A flat bank folder (e.g. `samples/bd/`) becomes a zero-indexed array in `strudel.json` — `bd:0`, `bd:1`, … in alphabetical order.

For pitched instruments, add subfolders named by note (e.g. `samples/rhodes/c4/`, `samples/rhodes/e4/`) and the generator will key the bank by note.

## Adding samples

1. Drop `.wav` / `.mp3` / `.ogg` / `.flac` files into the relevant `samples/<bank>/` folder. Create new banks as needed.
2. Regenerate the manifest:
   ```
   node generate-strudel-json.mjs joeymorello/live-sample-repo main
   ```
   (The `_base` is sticky — after the first run you can just call `node generate-strudel-json.mjs`.)
3. Commit and push.

## Using in Strudel

At the top of a Strudel pattern:

```js
samples('github:joeymorello/live-sample-repo')
// or a specific branch / cache-bust:
samples('github:joeymorello/live-sample-repo/main')
samples('https://raw.githubusercontent.com/joeymorello/live-sample-repo/main/strudel.json?v=2')

s("bd ~ sd ~, hh*8")
```

Strudel caches the manifest aggressively — bump a `?v=N` query string when iterating.

## Setup checklist

- [ ] `git init -b main && git add . && git commit -m "init"`
- [ ] `git remote add origin https://github.com/joeymorello/live-sample-repo.git`
- [ ] `git push -u origin main`
- [ ] Confirm `https://raw.githubusercontent.com/joeymorello/live-sample-repo/main/strudel.json` loads in a browser.
- [ ] Test with `samples('github:joeymorello/live-sample-repo')` in strudel.cc.

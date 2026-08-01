# Asset credits & licensing

## What ships in this repo

Everything under `assets/sprites/` and `assets/audio/` is **original
placeholder content** made for this project:

- Sprites are simple SVG blobs (`chiikawa`, `hachiware`, `usagi`, `rakko`,
  `player`). They are deliberately generic so the repo carries no third-party
  artwork.
- There are no audio files by default — sound is generated at runtime with the
  Web Audio API (see `src/audio.js`).

All placeholder assets are released under the repo's MIT license.

## Using your own images (local only)

The game looks for PNG/SVG files by name and falls back to procedural drawing
when they are missing:

```
assets/sprites/player.png
assets/sprites/chiikawa.png
assets/sprites/hachiware.png
assets/sprites/usagi.png
assets/sprites/rakko.png
```

Drop replacements in with those exact names and reload. **Do not commit
copyrighted artwork.** "Chiikawa" (ちいかわ) and its characters belong to
Nagano / their rights holders; using official art is fine for a private,
personal, non-commercial build on your own machine, but it must stay out of
version control. `.gitignore` and CI both guard against committing it.

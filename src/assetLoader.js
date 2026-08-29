import { SPRITE_NAMES } from './config.js';

/**
 * Loads optional sprite images. For each name it tries `.png` first (the
 * local-only drop-in path — see assets/CREDITS.md) then the committed `.svg`
 * placeholder. If both fail the entry is `null` and the entity draws itself
 * procedurally.
 *
 * Returns a Map<string, HTMLImageElement|null>.
 */
export async function loadSprites(basePath = './assets/sprites') {
  const entries = await Promise.all(
    SPRITE_NAMES.map(async (name) => {
      for (const ext of ['png', 'svg']) {
        const img = await tryLoad(`${basePath}/${name}.${ext}`);
        if (img) return [name, img];
      }
      return [name, null];
    })
  );
  return new Map(entries);
}

function tryLoad(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

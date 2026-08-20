/**
 * Environment/accessibility flags. Read once; `prefers-reduced-motion` almost
 * never changes mid-session and we don't want a media-query listener in the
 * hot path.
 */
const reducedMotionQuery =
  typeof window !== 'undefined' && window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false };

export const prefersReducedMotion = () => reducedMotionQuery.matches;

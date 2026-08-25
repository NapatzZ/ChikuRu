/**
 * Tiny persistence layer over localStorage. Everything the game saves lives
 * under one JSON namespace so it's one key to inspect or clear. Every access is
 * guarded — private-mode Safari and disabled storage both throw.
 */
const NAMESPACE = 'chikuru:v1';

function readAll() {
  try {
    return JSON.parse(localStorage.getItem(NAMESPACE)) || {};
  } catch {
    return {};
  }
}

function writeAll(obj) {
  try {
    localStorage.setItem(NAMESPACE, JSON.stringify(obj));
  } catch {
    /* storage unavailable — values are session-only, which is acceptable */
  }
}

export const storage = {
  get(key, fallback) {
    const value = readAll()[key];
    return value === undefined ? fallback : value;
  },
  set(key, value) {
    const all = readAll();
    all[key] = value;
    writeAll(all);
  },
  clear() {
    writeAll({});
  }
};

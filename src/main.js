// Entry point. For the setup sprint this only proves the module graph loads.
// Sprint 1 replaces the body with real canvas bootstrapping.

const fallback = document.getElementById('boot-fallback');
if (fallback) {
  fallback.textContent = 'ChikuRu — module graph loaded. Game code lands in Sprint 1.';
}

console.info('ChikuRu boot: setup sprint scaffold');

// Stale-page repair stub. Only the pre-2026 homepage loads /app.js (as
// /app.js?v=2.1); the redesigned site never does. Browsers may still hold
// that old page in their HTTP cache (HTML is served without Cache-Control),
// and it no longer works against the current assets. Refetch the page with
// cache:'reload' to overwrite the cached copy, then reload once. The
// sessionStorage flag stops a reload loop. Safe to delete once old caches
// have expired (a few months after the 2026-09-25 launch).
if (!document.getElementById('life-canvas')) {
  const KEY = 'nitida-stale-reload';
  let alreadyTried = false;
  try {
    alreadyTried = sessionStorage.getItem(KEY) === '1';
    sessionStorage.setItem(KEY, '1');
  } catch {
    alreadyTried = true; // no storage: don't risk a loop
  }
  if (!alreadyTried) {
    fetch(location.href, { cache: 'reload' })
      .then(() => location.reload())
      .catch(() => {});
  }
}

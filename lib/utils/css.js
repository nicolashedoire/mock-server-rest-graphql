import { defaultStyles } from './styles.js';

// -----------------------------------------------------------------------------
// utils/css.js (or similar)
// -----------------------------------------------------------------------------
// Inject a <style> tag containing the widget's default CSS rules into the current
// document <head>. The helper is idempotent: if the styles have already been
// added, the function exits early.
// -----------------------------------------------------------------------------

/**
 * Ensure that the default Data‑Mocker CSS rules are present in the page.
 *
 * The stylesheet is injected only **once** per document. Subsequent calls are
 * cheap no‑ops, allowing every widget instance to safely invoke the helper
 * without explicit coordination.
 */
export function ensureCss() {
  // Avoid duplicates by checking for a hard‑coded ID (fastest query method).
  if (document.getElementById('data-mocker-styles')) return;

  // Create a <style> element and append the shared CSS rules.
  const styleEl = document.createElement('style');
  styleEl.id = 'data-mocker-styles';
  styleEl.textContent = defaultStyles;

  // Insert at the end of <head> so it wins over third‑party resets but can
  // still be overridden by consumer‑level stylesheets loaded later.
  document.head.appendChild(styleEl);
}
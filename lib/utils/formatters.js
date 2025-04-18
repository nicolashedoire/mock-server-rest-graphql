// -----------------------------------------------------------------------------
// utils/format-json.js (or similar)
// -----------------------------------------------------------------------------
// Render a JavaScript value as syntax‑highlighted HTML. Intended for read‑only
// preview components (e.g. API response viewers) where the output is injected
// into the DOM via `innerHTML`.
//
// ⚠️  SECURITY NOTE
//      The function escapes all critical characters in string literals to
//      mitigate obvious XSS vectors, but the final HTML is still a raw string.
//      Consumers **must** ensure that the target container is either fully
//      sandboxed or managed in a context where untrusted user input cannot
//      reach the function. For production‑grade applications consider using a
//      virtual DOM library or a dedicated JSON viewer instead.
// -----------------------------------------------------------------------------

/**
 * Convert any serialisable JavaScript value into a colorised HTML fragment.
 *
 * @template T
 * @param {T} obj          Value to render. Typically an object or array but
 *                         primitives work as well.
 * @param {Record<string,string>} classes  CSS class map (token -> className)
 *                         Expected keys: jsonNull, jsonBoolean, jsonNumber,
 *                         jsonString, jsonKey.
 * @returns {string}       HTML string with <span> wrappers for each token type.
 */
export function formatJson(obj, classes) {
  try {
    /** Recursive pretty‑printer.
     * @param {any} value
     * @param {number} indent Current indentation level (spaces)
     * @returns {string}
     */
    const formatValue = (value, indent = 0) => {
      const pad = ' '.repeat(indent);

      // ----------------------------------------------- Null
      if (value === null) {
        return `<span class="${classes.jsonNull}">null</span>`;
      }

      // ----------------------------------------------- Boolean
      if (typeof value === 'boolean') {
        return `<span class="${classes.jsonBoolean}">${value}</span>`;
      }

      // ----------------------------------------------- Number (int | float)
      if (typeof value === 'number') {
        return `<span class="${classes.jsonNumber}">${value}</span>`;
      }

      // ----------------------------------------------- String (escaped)
      if (typeof value === 'string') {
        const escaped = value
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&#039;');
        return `<span class="${classes.jsonString}">"${escaped}"</span>`;
      }

      // ----------------------------------------------- Array
      if (Array.isArray(value)) {
        if (!value.length) return '[]';
        const items = value
          .map((item) => `${pad}  ${formatValue(item, indent + 2)}`)
          .join(',\n');
        return `[\n${items}\n${pad}]`;
      }

      // ----------------------------------------------- Object
      if (typeof value === 'object') {
        const entries = Object.entries(value);
        if (!entries.length) return '{}';
        const props = entries
          .map(
            ([k, v]) =>
              `${pad}  <span class="${classes.jsonKey}">"${k}"</span>: ${formatValue(v, indent + 2)}`,
          )
          .join(',\n');
        return `{\n${props}\n${pad}}`;
      }

      // ----------------------------------------------- Fallback (symbol, etc.)
      return String(value);
    };

    return formatValue(obj);
  } catch (err) {
    console.error('[formatJson] Failed to render value:', err);
    // Fallback: plain JSON without colorisation.
    return `<pre>${JSON.stringify(obj, null, 2)}</pre>`;
  }
}

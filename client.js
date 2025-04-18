// -----------------------------------------------------------------------------
// index.js (package root)
// -----------------------------------------------------------------------------
// Barrel file exposing the widget factory so consumers can simply:
//   const { initDataMockerWidget } = require('data‑mocker');
// instead of digging into `lib/` internals. The indirection also shields the
// API surface in case the internal directory structure changes later.
// -----------------------------------------------------------------------------

/**
 * Factory function that mounts a new DataMockerWidget.
 *
 * @type {import('./lib/DataMockerWidget.js').initDataMockerWidget}
 */
const initDataMockerWidget = require('./lib/DataMockerWidget.js').initDataMockerWidget;

module.exports = {
  initDataMockerWidget,
};

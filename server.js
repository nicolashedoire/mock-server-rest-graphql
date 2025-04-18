// -----------------------------------------------------------------------------
// mock-server.js (root-level re‑export)
// -----------------------------------------------------------------------------
// One‑liner barrel file exposing the Node.js mock server so consumers can fire
// it up with:
//   const startServer = require('data‑mocker/mock-server');
// without referencing internal paths.
// -----------------------------------------------------------------------------

/**
 * @type {import('./lib/mock-server.js')}
 */
module.exports = require('./lib/mock-server.js');
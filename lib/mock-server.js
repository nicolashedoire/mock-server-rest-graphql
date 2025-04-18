/* eslint-disable @typescript-eslint/no-require-imports */
// -----------------------------------------------------------------------------
// lib/mock-server.js
// -----------------------------------------------------------------------------
// Lightweight HTTP server that dynamically serves both:
//   1. REST endpoints (GET) configured in an external JSON file.
//   2. A single GraphQL endpoint automatically generated from the same config.
//
// The file is intended for **local development only**. It allows frontend
// engineers to iterate on UI features without waiting for real backend work.
// -----------------------------------------------------------------------------

const http = require('http');
const fs = require('fs');
const path = require('path');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');
const { addMocksToSchema } = require('@graphql-tools/mock');

/**
 * In‑memory cache of REST routes loaded from disk.
 * @type {Array<{name: string, response: unknown}>}
 */
let restEndpoints = [];

/**
 * Executable GraphQL schema with mocks injected. Rebuilt every time the REST
 * config file changes so both representations stay in sync.
 * @type {import('graphql').GraphQLSchema | null}
 */
let gqlSchemaWithMocks = null;

// -----------------------------------------------------------------------------
// Helper utilities
// -----------------------------------------------------------------------------

/**
 * Infer a GraphQL scalar or list type from a plain JavaScript value.
 *
 * @param {unknown} val Sample value to inspect.
 * @returns {string} GraphQL type name or list notation (e.g. "[String]").
 */
function inferType(val) {
  if (Array.isArray(val)) return `[${inferType(val[0] ?? null)}]`;
  switch (typeof val) {
    case 'string':
      return 'String';
    case 'boolean':
      return 'Boolean';
    case 'number':
      return Number.isInteger(val) ? 'Int' : 'Float';
    case 'object':
      return 'JSON'; // See `scalar JSON` added to the SDL below.
    default:
      return 'String';
  }
}

/**
 * Load endpoints from disk and regenerate both the REST map and
 * the GraphQL mock schema.
 *
 * @param {string} configPath Absolute path to the endpoints.json file.
 * @throws Will propagate any fs/errors up to the caller.
 */
function buildSchemas(configPath) {
  // ------------------------
  // 1. Rebuild REST cache
  // ------------------------
  const raw = fs.readFileSync(configPath, 'utf-8');
  restEndpoints = JSON.parse(raw);
  console.log('[mock‑server] Loaded', restEndpoints.length, 'endpoints from', configPath);

  // ------------------------
  // 2. Generate GraphQL SDL
  // ------------------------
  let typeDefs = 'scalar JSON\n'; // custom scalar for arbitrary objects
  const queryFields = [];

  restEndpoints.forEach((ep) => {
    // Derive a valid field name from the REST path (e.g. '/users' -> 'users')
    const fieldName = ep.name.replace(/^\//, '').replace(/\W+/g, '_');

    // Sample a representative item to infer the return type.
    let sample = ep.response;
    if (Array.isArray(sample)) sample = sample[0] ?? {};

    // If the sample is an object, create a named GraphQL type for its shape.
    if (typeof sample === 'object' && sample !== null) {
      const typeName = `${fieldName.charAt(0).toUpperCase()}${fieldName.slice(1)}Type`;
      const fieldsSDL = Object.entries(sample)
        .map(([k, v]) => `  ${k}: ${inferType(v)}`)
        .join('\n');
      typeDefs += `type ${typeName} {\n${fieldsSDL}\n}\n`;
      queryFields.push(`  ${fieldName}: [${typeName}]`);
    } else {
      // Primitive value or array of primitives
      queryFields.push(`  ${fieldName}: ${inferType(ep.response)}`);
    }
  });

  typeDefs += `type Query {\n${queryFields.join('\n')}\n}`;

  // Create an executable schema & add default mocks (randomized values)
  const schema = makeExecutableSchema({ typeDefs });
  gqlSchemaWithMocks = addMocksToSchema({ schema, preserveResolvers: false });
  console.log('[mock‑server] GraphQL schema regenerated');
}

// -----------------------------------------------------------------------------
// Public API – server bootstrapper
// -----------------------------------------------------------------------------

/**
 * Spin up the HTTP server.
 *
 * @param {string} [providedConfigPath] Optional absolute/relative path to the
 *        endpoints.json file. Defaults to `public/config/endpoints.json`.
 */
function startServer(providedConfigPath) {
  const configPath = providedConfigPath || path.join(__dirname, '..', 'public', 'config', 'endpoints.json');

  // Initial build; bail early on failure.
  try {
    buildSchemas(configPath);
  } catch (err) {
    console.error('[mock‑server] Failed to build schemas:', err);
    process.exit(1);
  }

  // ---------------------------------------------------------------
  // HTTP server
  // ---------------------------------------------------------------
  const server = http.createServer((req, res) => {
    // ----- CORS preflight
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.writeHead(204).end();

    // ----- Live config hot‑reload (POST /__mock/update)
    if (req.method === 'POST' && req.url === '/__mock/update') {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', () => {
        try {
          const updated = JSON.parse(body);
          if (!Array.isArray(updated)) throw new Error('Expected array');
          fs.writeFileSync(configPath, JSON.stringify(updated, null, 2));
          buildSchemas(configPath);
          res.writeHead(200, { 'Content-Type': 'text/plain' }).end('OK');
        } catch {
          res.writeHead(400, { 'Content-Type': 'text/plain' }).end('Invalid payload');
        }
      });
      return; // prevent further handling
    }

    // ----- GraphQL endpoint (POST /graphql)
    if (req.url === '/graphql' && gqlSchemaWithMocks) {
      let body = '';
      req.on('data', (chunk) => (body += chunk));
      req.on('end', async () => {
        try {
          const { query, variables } = JSON.parse(body);
          const result = await graphql({ schema: gqlSchemaWithMocks, source: query, variableValues: variables });
          res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(result));
        } catch {
          res.writeHead(400).end('Bad GraphQL request');
        }
      });
      return;
    }

    // ----- REST endpoint lookup (GET)
    const route = restEndpoints.find((e) => e.name === req.url);
    if (route) {
      res.writeHead(200, { 'Content-Type': 'application/json' }).end(JSON.stringify(route.response));
      return;
    }

    // ----- 404 fallback
    res.writeHead(404, { 'Content-Type': 'text/plain' }).end('Not found');
  });

  const port = process.env.PORT || 3001;
  server.listen(port, () => {
    console.log(`\n[mock‑server] 🚀  Listening on http://localhost:${port}`);
    console.log('[mock‑server] REST routes:', restEndpoints.map((e) => e.name).join(', '));
    console.log(`[mock‑server] GraphQL endpoint: POST http://localhost:${port}/graphql`);
  });
}

// -----------------------------------------------------------------------------
// CLI entrypoint – "node lib/mock-server.js [path/to/endpoints.json]"
// -----------------------------------------------------------------------------
if (require.main === module) {
  startServer(process.argv[2]);
}

// Exported for programmatic usage (e.g. test harness, custom CLI wrappers)
module.exports = startServer;

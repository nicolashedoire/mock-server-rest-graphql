#!/usr/bin/env node
const startServer = require('../lib/mock-server.js');

const arg = process.argv[2];
if (!arg || arg === '--help' || arg === '-h') {
  console.log(`
Usage: mock-server-rest-graphql [path/to/endpoints.json]

  path/to/endpoints.json  Chemin vers ton fichier de config (JSON array)
  --help, -h              Affiche cette aide
`);
  process.exit(0);
}

startServer(arg);
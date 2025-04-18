// -----------------------------------------------------------------------------
// index.d.ts (public barrel)
// -----------------------------------------------------------------------------
// Re‑export every declaration from the *types* folder so library consumers can
// simply `import { DataMockerWidget } from 'data‑mocker';` without specifying
// the deeper path. Keeps the public API surface stable even if the internal
// directory layout evolves.
// -----------------------------------------------------------------------------

export * from './types/index';
// -----------------------------------------------------------------------------
// types/index.d.ts (public entry point)
// -----------------------------------------------------------------------------
// Official TypeScript declarations for the *data‑mocker* package.
//
//  •  `DataMockerOptions`   – configuration object accepted by the widget
//  •  `DataMockerWidget`    – class wrapper (imperative API)
//  •  `initDataMockerWidget`– convenience factory mirroring the JS helper
//  •  `startServer`         – Node.js mock server bootstrapper
// -----------------------------------------------------------------------------

/**
 * Configuration object passed to {@link initDataMockerWidget} or the class
 * constructor. Every property is optional except {@link DataMockerOptions.mountPoint}.
 */
export interface DataMockerOptions {
  /** DOM element that will host the widget UI. */
  mountPoint: HTMLElement;

  /** Optional URL pointing to a JSON file of endpoint definitions. */
  configUrl?: string;

  /** Initial set of endpoint mocks (bypasses the fetch if provided). */
  endpoints?: Array<{ name: string; response: any }>;

  /**
   * Callback fired whenever the list of endpoints is mutated (add / replace /
   * delete). Receives the *new* array reference.
   */
  onChange?: (endpoints: Array<{ name: string; response: any }>) => void;

  /**
   * Optional CSS class overrides. The widget falls back to its internal
   * defaults for any field left undefined.
   */
  classes?: {
    wrapper?: string;
    closeBtn?: string;
    title?: string;
    list?: string;
    listItem?: string;
    btnView?: string;
    btnDel?: string;
    pre?: string;
    form?: string;
    input?: string;
    textarea?: string;
    btnSave?: string;
  };
}

/**
 * Imperative wrapper exposing lifecycle hooks (e.g. {@link destroy}).
 * Instances are typically created via {@link initDataMockerWidget} rather than
 * new‑ing the class directly, but both patterns are supported.
 */
export class DataMockerWidget {
  constructor(opts: DataMockerOptions);
  /** Cleanly detach the widget from the DOM and free listeners. */
  destroy(): void;
}

/**
 * Primary entry point for browser consumers. Internally calls `new
 * DataMockerWidget(opts)` but keeps the construction logic in one place.
 */
export function initDataMockerWidget(opts: DataMockerOptions): DataMockerWidget;

/**
 * Spin up the standalone HTTP mock server (Node.js / CLI environments only).
 * When `configPath` is omitted, the helper falls back to
 * `public/config/endpoints.json`.
 */
export function startServer(configPath?: string): void;

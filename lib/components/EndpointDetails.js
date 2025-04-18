import { formatJson } from '../utils/formatters.js';

// -----------------------------------------------------------------------------
// components/EndpointDetails.js
// -----------------------------------------------------------------------------
// Present a single endpoint in a split‑panel style: metadata header + formatted
// JSON preview. The component is **read‑only**; mutations are handled upstream
// by the parent widget.
// -----------------------------------------------------------------------------

/**
 * Render a collapsible detail view for the given endpoint definition.
 *
 * @typedef {Object} EndpointDefinition
 * @property {string} name     REST route (e.g. "/users")
 * @property {any}    response Mock payload associated with the route
 *
 * @param {HTMLElement} container Mount point (usually managed by the widget).
 * @param {EndpointDefinition} endpoint  Endpoint object to inspect.
 * @param {Record<string,string>} classes CSS utility class map. Expected keys:
 *        pre, jsonNull, jsonBoolean, jsonNumber, jsonString, jsonKey.
 * @param {Object<string,Object>} [styles={}] Inline style overrides (unused in
 *        the current implementation but kept for API symmetry).
 * @returns {HTMLElement} The newly created wrapper element (useful for tests).
 */
export function createEndpointDetails(container, endpoint, classes, styles = {}) {
  // -------------------------------------------------------------------------
  // Wrapper
  // -------------------------------------------------------------------------
  const wrapper = document.createElement('div');
  wrapper.className = 'data-mocker-border data-mocker-border-gray-200 data-mocker-rounded-lg data-mocker-overflow-hidden';

  // -------------------------------------------------------------------------
  // Header – route + payload type + copy button
  // -------------------------------------------------------------------------
  const header = document.createElement('div');
  header.className = 'data-mocker-bg-gray-100 data-mocker-px-4 data-mocker-py-3 data-mocker-flex data-mocker-justify-between data-mocker-items-center data-mocker-border-b data-mocker-border-gray-200';

  // Route + payload meta
  const infoBlock = document.createElement('div');
  infoBlock.className = 'data-mocker-flex data-mocker-flex-col';

  const routeSpan = document.createElement('span');
  routeSpan.className = 'data-mocker-text-sm data-mocker-font-medium data-mocker-text-gray-700';
  routeSpan.textContent = endpoint.name;

  const typeSpan = document.createElement('span');
  typeSpan.className = 'data-mocker-text-xs data-mocker-text-gray-500';
  typeSpan.textContent = Array.isArray(endpoint.response)
    ? `Array (${endpoint.response.length} items)`
    : typeof endpoint.response === 'object'
      ? 'Object'
      : typeof endpoint.response;

  infoBlock.append(routeSpan, typeSpan);

  // Action buttons (currently only "copy")
  const actions = document.createElement('div');
  actions.className = 'data-mocker-flex data-mocker-items-center data-mocker-space-x-2';

  const copyBtn = document.createElement('button');
  copyBtn.className = 'data-mocker-text-gray-500 data-mocker-hover-text-blue-500';
  copyBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-5 data-mocker-w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>`;
  copyBtn.addEventListener('click', () => copyEndpointJson(endpoint));

  actions.append(copyBtn);
  header.append(infoBlock, actions);

  // -------------------------------------------------------------------------
  // JSON preview (syntax‑highlighted)
  // -------------------------------------------------------------------------
  const preWrapper = document.createElement('div');
  preWrapper.className = 'data-mocker-p-4 data-mocker-bg-white';

  const pre = document.createElement('pre');
  pre.className = `${classes.pre ?? 'data-mocker-pre'} data-mocker-text-xs data-mocker-overflow-auto data-mocker-max-h-64`;

  // Use formatJson() to transform the payload into colorised HTML.
  pre.innerHTML = formatJson(endpoint.response, classes);

  preWrapper.append(pre);

  // -------------------------------------------------------------------------
  // Assemble and attach
  // -------------------------------------------------------------------------
  wrapper.append(header, preWrapper);
  container.appendChild(wrapper);
  return wrapper;
}

// -----------------------------------------------------------------------------
// Clipboard helper
// -----------------------------------------------------------------------------

/**
 * Copy the endpoint payload to the system clipboard and display a toast.
 *
 * @param {EndpointDefinition} endpoint Source endpoint.
 */
export function copyEndpointJson(endpoint) {
  // Modern Clipboard API wrapped in a try/catch for Safari / older browsers.
  navigator.clipboard
    .writeText(JSON.stringify(endpoint.response, null, 2))
    .then(() => import('./Notifications.js').then((m) => m.showNotification('JSON copied'))) // success
    .catch((err) => {
      console.error('[copyEndpointJson] Clipboard write failed:', err);
      import('./Notifications.js').then((m) => m.showNotification('Failed to copy JSON', 'error'));
    });
}

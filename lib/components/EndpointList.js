// -----------------------------------------------------------------------------
// components/EndpointList.js
// -----------------------------------------------------------------------------
// Render an interactive, collapsible list of mock endpoints. Each row exposes
// a “view” and a “delete” icon; clicking anywhere on the row also selects the
// endpoint. The component is **stateless**: all data mutations are delegated
// to callbacks provided by the parent widget.
// -----------------------------------------------------------------------------

/**
 * @typedef {Object} EndpointDefinition
 * @property {string} name     Route path (e.g. "/users")
 * @property {any}    response Mock JSON payload returned by the server
 */

/**
 * @typedef {Object} EndpointListCallbacks
 * @property {(index: number) => void} [onSelectEndpoint]
 *           Fired when the user clicks a row or the "view" icon.
 * @property {(index: number) => void} [onDeleteEndpoint]
 *           Fired after the user confirms deletion from the trash icon.
 * @property {(isExpanded: boolean) => void} [onToggleList]
 *           Fired whenever the list is collapsed/expanded via the chevron.
 */

/**
 * Build the endpoint list UI.
 *
 * @param {HTMLElement} container       Mount point.
 * @param {EndpointDefinition[]} endpoints  Array of endpoints to render.
 * @param {number|null} activeEndpoint  Index currently highlighted (may be
 *                                      null if none is selected).
 * @param {Record<string,string>} classes CSS utility class map coming from the
 *                                      parent widget.
 * @param {Object<string,Object>} [styles={}] Inline style overrides.
 * @param {EndpointListCallbacks} [callbacks={}] Event hooks.
 * @returns {{ element: HTMLElement, toggle: () => void }} Public controls.
 */
export function createEndpointList(
  container,
  endpoints,
  activeEndpoint,
  classes,
  styles = {},
  callbacks = {},
) {
  const { onSelectEndpoint, onDeleteEndpoint, onToggleList } = callbacks;

  // -------------------------------------------------------------------------
  // Wrapper + header (title + chevron)
  // -------------------------------------------------------------------------
  const wrapper = document.createElement('div');
  wrapper.className = 'data-mocker-relative';

  const header = document.createElement('div');
  header.className = 'data-mocker-flex data-mocker-justify-between data-mocker-items-center data-mocker-border-b data-mocker-border-gray-200 data-mocker-pb-2 data-mocker-mb-2';

  const title = document.createElement('h3');
  title.className = 'data-mocker-text-md data-mocker-font-semibold data-mocker-text-gray-700';
  title.textContent = 'Endpoints';

  const chevron = document.createElement('button');
  chevron.className = 'data-mocker-text-gray-500 data-mocker-hover-text-gray-700';
  chevron.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-5 data-mocker-w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>`;

  // Collapse state — true = expanded
  let isExpanded = true;
  const toggleListVisibility = () => {
    isExpanded = !isExpanded;
    listEl.style.display = isExpanded ? 'block' : 'none';
    chevron.querySelector('svg').style.transform = isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)';
    if (typeof onToggleList === 'function') onToggleList(isExpanded);
  };
  chevron.addEventListener('click', toggleListVisibility);

  header.append(title, chevron);
  wrapper.appendChild(header);

  // -------------------------------------------------------------------------
  // Empty state shortcut
  // -------------------------------------------------------------------------
  if (!endpoints?.length) {
    createEmptyState(wrapper, classes);
    container.appendChild(wrapper);
    return { element: wrapper, toggle: toggleListVisibility };
  }

  // -------------------------------------------------------------------------
  // <ul> — main list
  // -------------------------------------------------------------------------
  const listEl = document.createElement('ul');
  listEl.className = classes.list;
  if (styles.list) Object.assign(listEl.style, styles.list);

  endpoints.forEach((ep, idx) => {
    const isActive = activeEndpoint === idx;

    // <li> wrapper
    const li = document.createElement('li');
    li.className = `${classes.listItem} ${isActive ? classes.activeItem : ''} data-mocker-group`;
    if (styles.listItem) Object.assign(li.style, styles.listItem);

    //-----------------------------------------------------------------------
    // Left block (icon + name + type badge)
    //-----------------------------------------------------------------------
    const left = document.createElement('div');
    left.className = 'data-mocker-flex data-mocker-items-center data-mocker-space-x-3';

    left.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-5 data-mocker-w-5 data-mocker-text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>`;

    const textBlock = document.createElement('div');
    textBlock.className = 'data-mocker-flex data-mocker-flex-col';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'data-mocker-font-medium data-mocker-text-sm data-mocker-text-gray-800';
    nameSpan.textContent = ep.name;

    const badge = document.createElement('span');
    badge.className = `${classes.badge} data-mocker-text-xs`;
    const responseType = Array.isArray(ep.response)
      ? `Array[${ep.response.length}]`
      : typeof ep.response === 'object' && ep.response !== null
        ? 'Object'
        : typeof ep.response;
    badge.textContent = responseType;
    if (styles.badge) Object.assign(badge.style, styles.badge);

    textBlock.append(nameSpan, badge);
    left.appendChild(textBlock);

    //-----------------------------------------------------------------------
    // Right block (view + delete buttons)
    //-----------------------------------------------------------------------
    const controls = document.createElement('div');
    controls.className = 'data-mocker-flex data-mocker-items-center data-mocker-space-x-2 data-mocker-group-hover-opacity-100';

    // "View" icon
    const btnView = document.createElement('button');
    btnView.className = `${classes.btnView} data-mocker-p-1 data-mocker-rounded-full data-mocker-hover-bg-blue-50`;
    btnView.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-5 data-mocker-w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
        <circle cx="12" cy="12" r="3"></circle>
      </svg>`;
    if (styles.btnView) Object.assign(btnView.style, styles.btnView);
    btnView.addEventListener('click', (e) => {
      e.stopPropagation();
      if (typeof onSelectEndpoint === 'function') onSelectEndpoint(idx);
    });

    // "Delete" icon
    const btnDel = document.createElement('button');
    btnDel.className = `${classes.btnDel} data-mocker-p-1 data-mocker-rounded-full data-mocker-hover-bg-red-50`;
    btnDel.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-5 data-mocker-w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M3 6h18"></path>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"></path>
        <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>`;
    if (styles.btnDel) Object.assign(btnDel.style, styles.btnDel);
    btnDel.addEventListener('click', (e) => {
      e.stopPropagation();
      if (confirm(`Delete endpoint \"${ep.name}\"?`)) {
        if (typeof onDeleteEndpoint === 'function') onDeleteEndpoint(idx);
      }
    });

    controls.append(btnView, btnDel);

    //-----------------------------------------------------------------------
    // Compose row
    //-----------------------------------------------------------------------
    li.append(left, controls);
    li.addEventListener('click', () => {
      if (typeof onSelectEndpoint === 'function') onSelectEndpoint(idx);
    });

    listEl.appendChild(li);
  });

  wrapper.appendChild(listEl);
  container.appendChild(wrapper);

  // -------------------------------------------------------------------------
  // Public handle
  // -------------------------------------------------------------------------
  return {
    element: wrapper,
    toggle: toggleListVisibility,
  };
}

// -----------------------------------------------------------------------------
// Internal: empty state helper
// -----------------------------------------------------------------------------

/**
 * Render a friendly empty state when there are no endpoints.
 * @param {HTMLElement} wrapper Parent element (usually the list wrapper).
 * @param {Record<string,string>} classes CSS class map (needs `emptyState`).
 * @returns {HTMLElement}
 */
function createEmptyState(wrapper, classes) {
  const empty = document.createElement('div');
  empty.className = classes.emptyState;
  empty.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-16 data-mocker-w-16 data-mocker-mb-4 data-mocker-text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
    <p class="data-mocker-text-gray-600 data-mocker-font-medium">No endpoints</p>
    <p class="data-mocker-text-sm data-mocker-text-gray-500 data-mocker-mt-1">Create your first endpoint to get started</p>`;

  wrapper.appendChild(empty);
  return empty;
}

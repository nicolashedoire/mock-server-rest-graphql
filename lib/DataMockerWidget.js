import { baseClasses, defaultStyles } from './utils/styles.js';
import { showNotification, showConfirmDialog } from './components/Notifications.js';
import { createEndpointList } from './components/EndpointList.js';
import { createEndpointForm } from './components/EndpointForm.js';
import { createEndpointDetails } from './components/EndpointDetails.js';
import { ensureCss } from './utils/css.js';

/**
 * DataMockerWidget
 * ----------------
 * Interactive UI widget that lets the user manage a small
 * collection of mock API endpoints (CRUD style).
 *
 * Responsibilities:
 *  - Load an optional remote JSON configuration
 *  - Render three sub‑components (list, form, details)
 *  - Propagate changes through an optional callback
 *  - Expose a destroy method to clean up DOM nodes
 *
 * Notes for maintainers:
 *  - All DOM nodes live under the `container` div created in `_initContainer`.
 *  - CSS class names are merged inside `_mergeClasses` to allow consumer overrides.
 *  - Never mutate `options` directly; copy the parts you need on construction.
 */
class DataMockerWidget {
  /**
   * @typedef {Object} WidgetOptions
   * @property {HTMLElement} mountPoint **Required.** Element into which the widget will be rendered.
   * @property {string} [configUrl]     Optional URL returning a JSON array of endpoints.
   * @property {Array<Object>} [endpoints] Initial list of endpoint descriptors.
   * @property {Function} [onChange]    Callback executed every time the endpoints array is mutated.
   * @property {Object<string,string>} [classes] CSS class‑name overrides.
   * @property {Object<string,Object>} [styles]  Inline style overrides.
   */

  /**
   * Creates the widget instance and immediately mounts it.
   *
   * @param {WidgetOptions} options
   */
  constructor(options) {
    // Guard against missing mount point early to avoid side effects later.
    if (!options || !options.mountPoint) {
      console.error('[DataMockerWidget] `mountPoint` is required.');
      return;
    }

    // Inject the default CSS sheet once per page load (idempotent).
    ensureCss(defaultStyles);

    /** @private */
    this.mountPoint = options.mountPoint;
    /** @private */
    this.configUrl = options.configUrl;
    /** @private */
    this.endpoints = options.endpoints || [];
    /** @private */
    this.onChange = options.onChange;

    /** @private Index of the currently selected endpoint or `null`. */
    this.activeEndpoint = null;

    /** @private */
    this.classes = this._mergeClasses(options.classes);
    /** @private */
    this.styles = options.styles || {};

    this._initContainer();
    this._loadConfig();
  }

  //--------------------------------------------------------------------------
  //  Private helpers
  //--------------------------------------------------------------------------

  /**
   * Merge consumer‑provided class‑names with the internal baseline.
   *
   * @param {Object<string,string>} [customClasses={}]
   * @returns {Object<string,string>} A new object containing the merged tokens.
   * @private
   */
  _mergeClasses(customClasses = {}) {
    const merged = {};

    for (const key in baseClasses) {
      // Both classes may be undefined; `filter(Boolean)` removes falsy values.
      merged[key] = [baseClasses[key], customClasses[key] || '']
        .filter(Boolean)
        .join(' ');
    }

    return merged;
  }

  /**
   * Build the main DOM skeleton for the widget.
   * @private
   */
  _initContainer() {
    // ---------------------------------------------------------------------
    // Wrapper
    // ---------------------------------------------------------------------
    this.container = document.createElement('div');
    this.container.className = this.classes.wrapper;

    // Apply optional inline styles passed by the consumer.
    if (this.styles.wrapper) {
      Object.assign(this.container.style, this.styles.wrapper);
    }

    // ---------------------------------------------------------------------
    // Header
    // ---------------------------------------------------------------------
    const header = document.createElement('div');
    header.className = this.classes.header;

    const title = document.createElement('h3');
    title.innerText = 'API mocks';

    const toggleBtn = document.createElement('button');
    toggleBtn.className = this.classes.toggleBtn;
    toggleBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
           viewBox="0 0 24 24" fill="none" stroke="currentColor"
           stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="6 9 12 15 18 9"></polyline>
      </svg>
    `;
    toggleBtn.addEventListener('click', () => this._toggleBody());

    header.append(title, toggleBtn);

    // ---------------------------------------------------------------------
    // Body
    // ---------------------------------------------------------------------
    this.body = document.createElement('div');
    this.body.className = this.classes.body;

    // Endpoint list container
    this.listContainer = document.createElement('div');
    this.listContainer.className = 'data-mocker-padding';

    // Endpoint details container
    this.detailsContainer = document.createElement('div');
    this.detailsContainer.className = 'data-mocker-hidden';

    // Endpoint form container
    this.formContainer = document.createElement('div');
    this.formContainer.className = 'data-mocker-padding';

    // Assemble containers
    this.body.append(this.listContainer, this.detailsContainer, this.formContainer);
    this.container.append(header, this.body);

    // Finally, attach the whole widget to the mount point
    this.mountPoint.appendChild(this.container);

    // Initial render of dynamic sub‑components
    this._renderList();
    this._renderForm();
  }

  /**
   * Fetch remote configuration (if any) and hydrate `this.endpoints`.
   * @private
   */
  _loadConfig() {
    if (!this.configUrl) return;

    fetch(this.configUrl)
      .then((res) => res.json())
      .then((data) => {
        this.endpoints = Array.isArray(data) ? data : [];
        this._renderList();
      })
      .catch((err) => {
        console.error('[DataMockerWidget] Failed to load configuration:', err);
        showNotification('Unable to load configuration', 'error');
      });
  }

  //--------------------------------------------------------------------------
  //  Rendering logic
  //--------------------------------------------------------------------------

  /**
   * Render the list of endpoints.
   * This method is idempotent and can be called as often as needed.
   * @private
   */
  _renderList() {
    this.listContainer.innerHTML = '';

    createEndpointList(
      this.listContainer,
      this.endpoints,
      this.activeEndpoint,
      this.classes,
      this.styles,
      {
        onSelectEndpoint: this._showEndpointDetails.bind(this),
        onDeleteEndpoint: this._deleteEndpoint.bind(this),
      },
    );
  }

  /**
   * Render the "add endpoint" form.
   * @private
   */
  _renderForm() {
    this.formContainer.innerHTML = '';

    createEndpointForm(
      this.formContainer,
      this.classes,
      this.styles,
      {
        onSubmit: this._addEndpoint.bind(this),
      },
    );
  }

  /**
   * Display endpoint details or collapse the panel if the same index is clicked twice.
   *
   * @param {number} index Position of the endpoint inside `this.endpoints`.
   * @private
   */
  _showEndpointDetails(index) {
    this.activeEndpoint = this.activeEndpoint === index ? null : index;

    // Refresh list to update active row state
    this.listContainer.innerHTML = '';
    this._renderList();

    // Handle side panel
    if (this.activeEndpoint !== null) {
      const endpoint = this.endpoints[this.activeEndpoint];

      this.detailsContainer.classList.remove('data-mocker-hidden');
      this.detailsContainer.style.position = 'relative';
      this.detailsContainer.innerHTML = '';

      createEndpointDetails(this.detailsContainer, endpoint, this.classes, this.styles);
    } else {
      this.detailsContainer.classList.add('data-mocker-hidden');
      this.detailsContainer.innerHTML = '';
    }
  }

  //--------------------------------------------------------------------------
  //  Mutation handlers
  //--------------------------------------------------------------------------

  /**
   * Add a new endpoint or optionally replace an existing one.
   *
   * @param {Object} newEndpoint Endpoint descriptor coming from the form.
   * @private
   */
  _addEndpoint(newEndpoint) {
    const existingIndex = this.endpoints.findIndex((ep) => ep.name === newEndpoint.name);

    const commit = () => {
      if (existingIndex !== -1) {
        this.endpoints[existingIndex] = newEndpoint;
      } else {
        this.endpoints.push(newEndpoint);
      }

      this._renderList();
      showNotification(existingIndex !== -1 ? 'Endpoint successfully updated' : 'Endpoint successfully added');

      if (typeof this.onChange === 'function') {
        this.onChange(this.endpoints);
      }
    };

    if (existingIndex !== -1) {
      showConfirmDialog(
        'Existing endpoint',
        `An endpoint with route "${newEndpoint.name}" already exists. Replace it?`,
        commit,
      );
    } else {
      commit();
    }
  }

  /**
   * Remove an endpoint from the collection.
   *
   * @param {number} index Index of the endpoint to delete inside the array.
   * @private
   */
  _deleteEndpoint(index) {
    showConfirmDialog(
      'Delete endpoint',
      `Are you sure you want to delete the endpoint "${this.endpoints[index].name}"?`,
      () => {
        this.endpoints.splice(index, 1);

        if (this.activeEndpoint === index) {
          this.activeEndpoint = null;
        }

        this._renderList();

        this.detailsContainer.innerHTML = '';
        this.detailsContainer.classList.add('data-mocker-hidden');

        showNotification('Endpoint successfully removed');

        if (typeof this.onChange === 'function') {
          this.onChange(this.endpoints);
        }
      },
    );
  }

  /**
   * Expand/collapse the widget body.
   * @private
   */
  _toggleBody() {
    this.body.classList.toggle('data-mocker-hidden');
  }

  //--------------------------------------------------------------------------
  //  Public API
  //--------------------------------------------------------------------------

  /**
   * Completely detach the widget from the DOM.
   */
  destroy() {
    if (this.container?.parentNode) {
      this.container.parentNode.removeChild(this.container);
    }
  }
}

/**
 * Convenience factory to match the pattern used in other widgets.
 *
 * @param {import('./DataMockerWidget.js').WidgetOptions} options
 * @returns {DataMockerWidget}
 */
export function initDataMockerWidget(options) {
  return new DataMockerWidget(options);
}

// Browser global for non‑module environments
if (typeof window !== 'undefined') {
  window.initDataMockerWidget = initDataMockerWidget;
}

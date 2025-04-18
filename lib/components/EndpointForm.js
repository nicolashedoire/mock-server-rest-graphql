// -----------------------------------------------------------------------------
// components/EndpointForm.js
// -----------------------------------------------------------------------------
// Render a self‑contained form that lets the user create—or overwrite—mock API
// endpoints. The component validates route syntax and ensures the response is
// valid JSON before delegating the actual persistence logic to a callback.
// -----------------------------------------------------------------------------

/**
 * Callback collection expected by {@link createEndpointForm}.
 * @typedef {Object} EndpointFormCallbacks
 * @property {(payload: {name: string, response: any}) => void} [onSubmit]
 *           Invoked with the parsed form payload when the user hits the
 *           "Create endpoint" button and validation succeeds.
 */

/**
 * Mount an endpoint creation form inside the given container.
 *
 * @param {HTMLElement} container  Target element where the <form> will be
 *                                 appended.
 * @param {Record<string,string>} classes  CSS class overrides coming from the
 *                                 parent widget. Expected keys: form,
 *                                 formGroup, label, input, textarea, btnSave.
 * @param {Object<string,Object>} [styles={}] Optional inline styles.
 * @param {EndpointFormCallbacks} [callbacks={}] Event hooks.
 * @returns {HTMLFormElement}      The freshly created <form> element (mainly
 *                                 useful for integration tests).
 */
export function createEndpointForm(container, classes, styles = {}, callbacks = {}) {
  const { onSubmit } = callbacks;

  // -------------------------------------------------------------------------
  // <form> root element
  // -------------------------------------------------------------------------
  const form = document.createElement('form');
  form.className = `${classes.form} data-mocker-space-y-4`;
  if (styles.form) Object.assign(form.style, styles.form);

  // -------------------------------------------------------------------------
  // Route input group
  // -------------------------------------------------------------------------
  const nameGroup = document.createElement('div');
  nameGroup.className = classes.formGroup;

  const nameLabel = document.createElement('label');
  nameLabel.className = classes.label;
  nameLabel.innerHTML = `
    <div class="data-mocker-flex data-mocker-items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-5 data-mocker-w-5 data-mocker-mr-2 data-mocker-text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
      </svg>
      Route Path
    </div>`;

  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameInput.name = 'name';
  nameInput.placeholder = '/api/example';
  nameInput.required = true;
  nameInput.className = `${classes.input} data-mocker-w-full`;
  if (styles.input) Object.assign(nameInput.style, styles.input);

  // Live regex check so the user gets instant feedback.
  const routeValidation = document.createElement('div');
  routeValidation.className = 'data-mocker-text-xs data-mocker-text-red-500 data-mocker-mt-1 data-mocker-hidden';

  nameInput.addEventListener('input', () => {
    const routeRegex = /^\/[a-zA-Z0-9_/-]*$/;
    const isInvalid = !!nameInput.value && !routeRegex.test(nameInput.value);
    routeValidation.textContent = isInvalid ? 'Invalid format. Example: /api/example' : '';
    routeValidation.classList.toggle('data-mocker-hidden', !isInvalid);
    nameInput.classList.toggle('data-mocker-border-red-500', isInvalid);
  });

  // -------------------------------------------------------------------------
  // JSON response textarea
  // -------------------------------------------------------------------------
  const responseGroup = document.createElement('div');
  responseGroup.className = classes.formGroup;

  const responseLabel = document.createElement('label');
  responseLabel.className = classes.label;
  responseLabel.innerHTML = `
    <div class="data-mocker-flex data-mocker-items-center">
      <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-5 data-mocker-w-5 data-mocker-mr-2 data-mocker-text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
      JSON Response
    </div>`;

  const responseTextarea = document.createElement('textarea');
  responseTextarea.name = 'response';
  responseTextarea.placeholder = '{\n  "id": 1,\n  "name": "Example",\n  "active": true\n}';
  responseTextarea.required = true;
  responseTextarea.className = `${classes.textarea} data-mocker-w-full data-mocker-font-mono`;
  if (styles.textarea) Object.assign(responseTextarea.style, styles.textarea);

  // Real‑time JSON parsing for quick feedback.
  const jsonValidation = document.createElement('div');
  jsonValidation.className = 'data-mocker-text-xs data-mocker-text-red-500 data-mocker-mt-1 data-mocker-hidden';

  responseTextarea.addEventListener('input', () => {
    try {
      const parsed = JSON.parse(responseTextarea.value);
      if (typeof parsed !== 'object') throw new Error('JSON must be an object or array');
      jsonValidation.classList.add('data-mocker-hidden');
      responseTextarea.classList.remove('data-mocker-border-red-500');
    } catch (err) {
      jsonValidation.textContent = `Invalid JSON: ${err.message}`;
      jsonValidation.classList.remove('data-mocker-hidden');
      responseTextarea.classList.add('data-mocker-border-red-500');
    }
  });

  // -------------------------------------------------------------------------
  // Submit button
  // -------------------------------------------------------------------------
  const saveBtn = document.createElement('button');
  saveBtn.type = 'submit';
  saveBtn.className = `${classes.btnSave} data-mocker-w-full data-mocker-flex data-mocker-items-center data-mocker-justify-center`;
  if (styles.btnSave) Object.assign(saveBtn.style, styles.btnSave);
  saveBtn.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="data-mocker-h-5 data-mocker-w-5 data-mocker-mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path>
      <polyline points="17 21 17 13 7 13 7 21"></polyline>
      <polyline points="7 3 7 8 15 8"></polyline>
    </svg>
    Create endpoint`;

  // -------------------------------------------------------------------------
  // Assemble form
  // -------------------------------------------------------------------------
  nameGroup.append(nameLabel, nameInput, routeValidation);
  responseGroup.append(responseLabel, responseTextarea, jsonValidation);
  form.append(nameGroup, responseGroup, saveBtn);

  // -------------------------------------------------------------------------
  // Submit handler
  // -------------------------------------------------------------------------
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Final validation pass (in case the user bypassed realtime checks).
    try {
      const routeRegex = /^\/[a-zA-Z0-9_/-]*$/;
      if (!routeRegex.test(nameInput.value)) throw new Error('Invalid route');
      const parsed = JSON.parse(responseTextarea.value);
      if (typeof parsed !== 'object') throw new Error('JSON must be an object or array');

      // Delegate persistence to the parent component.
      if (typeof onSubmit === 'function') onSubmit({ name: nameInput.value.trim(), response: parsed });

      // Reset UI for the next entry.
      nameInput.value = '';
      responseTextarea.value = '';
      routeValidation.classList.add('data-mocker-hidden');
      jsonValidation.classList.add('data-mocker-hidden');
    } catch (err) {
      import('./Notifications.js').then((m) => m.showErrorDialog(err));
    }
  });

  // Mount the form
  container.appendChild(form);
  return form;
}

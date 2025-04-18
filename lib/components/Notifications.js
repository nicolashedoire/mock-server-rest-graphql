// -----------------------------------------------------------------------------
// utils/Notifications.js
// -----------------------------------------------------------------------------
// Simple, framework‑agnostic helpers for transient toasts and lightweight modal
// dialogs. All DOM nodes are created imperatively and removed once the user
// interacts or the timeout expires.
// *  <showNotification>  – green/red toast that fades out after 3 s.
// *  <showConfirmDialog> – yes/no modal with callbacks.
// *  <showErrorDialog>   – one‑button modal for error reporting.
// -----------------------------------------------------------------------------

// Time constants (ms) – tweak here to change behaviour project‑wide.
const TOAST_TIMEOUT   = 3000;
const FADE_DURATION   = 300;   // matches CSS transition – keep in sync!

/**
 * Display a toast message at the bottom‑centre of the viewport.
 *
 * @param {string} message Human‑readable text shown inside the toast.
 * @param {('success' | 'error')} [type='success'] Visual style to apply.
 */
export function showNotification(message, type = 'success') {
  const toast = document.createElement('div');
  Object.assign(toast.style, {
    position: 'fixed',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.75rem 1.5rem',
    borderRadius: '0.375rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
    zIndex: '9999',
    opacity: '0',           // fade‑in handled below
    transition: 'opacity 0.3s ease',
    backgroundColor: type === 'success' ? '#10b981' : '#ef4444',
    color: 'white',
  });

  toast.innerHTML = type === 'success'
    ? `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
      <span>${message}</span>`
    : `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
      <span>${message}</span>`;

  document.body.appendChild(toast);

  // Trigger CSS fade‑in in the next frame.
  requestAnimationFrame(() => (toast.style.opacity = '1'));

  // Fade‑out + cleanup.
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => document.body.removeChild(toast), FADE_DURATION);
  }, TOAST_TIMEOUT);
}

/**
 * Display a modal confirmation dialog with "Confirm" and "Cancel" buttons.
 *
 * @param {string}   title      Bold heading text.
 * @param {string}   message    Supporting paragraph.
 * @param {() => void} onConfirm Callback executed if the user clicks *Confirm*.
 * @param {() => void} [onCancel] Callback executed if the user clicks *Cancel*
 *                                or closes the dialog via other means.
 */
export function showConfirmDialog(title, message, onConfirm, onCancel) {
  // Overlay
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
  });

  // Dialog box
  const box = document.createElement('div');
  Object.assign(box.style, {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    maxWidth: '90%',
    width: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  });

  box.innerHTML = `
    <div style="display:flex;align-items:center;margin-bottom:1rem;font-weight:bold;color:#4b5563;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem;color:#eab308;"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
      ${title}
    </div>
    <p style="margin-bottom:1.5rem;color:#4b5563;">${message}</p>
    <div style="display:flex;gap:0.5rem;">
      <button class="cancel" style="flex:1;padding:0.5rem;background-color:#e5e7eb;color:#4b5563;border:none;border-radius:0.25rem;cursor:pointer;">Cancel</button>
      <button class="confirm" style="flex:1;padding:0.5rem;background-color:#3b82f6;color:white;border:none;border-radius:0.25rem;cursor:pointer;">Confirm</button>
    </div>`;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  const cleanup = () => document.body.removeChild(overlay);

  box.querySelector('.cancel').addEventListener('click', () => {
    cleanup();
    onCancel?.();
  });
  box.querySelector('.confirm').addEventListener('click', () => {
    cleanup();
    onConfirm?.();
  });
}

/**
 * Display a modal error dialog with a single *OK* button.
 *
 * @param {Error} error Native Error object – its `message` is displayed.
 */
export function showErrorDialog(error) {
  const overlay = document.createElement('div');
  Object.assign(overlay.style, {
    position: 'fixed',
    inset: '0',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: '9999',
  });

  const box = document.createElement('div');
  Object.assign(box.style, {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '0.5rem',
    maxWidth: '90%',
    width: '400px',
    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
  });

  box.innerHTML = `
    <div style="color:#ef4444;display:flex;align-items:center;margin-bottom:1rem;font-weight:bold;">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:0.5rem;"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
      JSON Error
    </div>
    <p style="margin-bottom:1.5rem;color:#4b5563;">${error.message}</p>
    <button style="width:100%;padding:0.5rem;background-color:#3b82f6;color:white;border:none;border-radius:0.25rem;cursor:pointer;">OK</button>`;

  overlay.appendChild(box);
  document.body.appendChild(overlay);

  box.querySelector('button').addEventListener('click', () => document.body.removeChild(overlay));
}
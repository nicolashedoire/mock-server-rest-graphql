export const defaultStyles = `
  .data-mocker-widget {
    position: fixed;
    top: 1rem;
    right: 1rem;
    z-index: 1050;
    width: 28rem;
    max-width: calc(100vw - 2rem);
    background: white;
    border-radius: 0.75rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.08);
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    overflow: hidden;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.08);
  }
  .data-mocker-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.875rem 1.25rem;
    background: linear-gradient(135deg, #4f46e5, #3b82f6);
    color: white;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  .data-mocker-header-title {
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.125rem;
    letter-spacing: -0.01em;
  }
  .data-mocker-toggle, .data-mocker-close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    padding: 0.375rem;
    border-radius: 9999px;
    cursor: pointer;
    transition: background-color 0.15s;
    background-color: rgba(255, 255, 255, 0.1);
    border: none;
  }
  .data-mocker-toggle:hover, .data-mocker-close:hover {
    background-color: rgba(255, 255, 255, 0.25);
  }
  .data-mocker-toggle:active, .data-mocker-close:active {
    background-color: rgba(255, 255, 255, 0.3);
  }
  .data-mocker-body {
    padding: 1.25rem 0;
    overflow: hidden;
    transition: all 0.3s ease;
  }
  .data-mocker-title {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 1.25rem;
    color: #111827;
    display: flex;
    align-items: center;
    padding: 0 1.25rem;
    letter-spacing: -0.02em;
  }
  .data-mocker-subtitle {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    padding-bottom: 0.625rem;
    border-bottom: 1px solid #e5e7eb;
    color: #374151;
    padding: 0 1.25rem;
  }
  .data-mocker-list {
    display: flex;
    flex-direction: column;
    gap: 0.625rem;
    margin-bottom: 1.5rem;
    max-height: 18rem;
    overflow-y: auto;
    padding: 0 1.25rem 0 1.25rem;
  }
  .data-mocker-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.875rem 1rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    background-color: white;
    transition: all 0.2s ease;
    cursor: pointer;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  .data-mocker-item:hover {
    background-color: #f9fafb;
    border-color: #d1d5db;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
    transform: translateY(-1px);
  }
  .data-mocker-active-item {
    border-left: 3px solid #4f46e5;
    background-color: #f5f7ff;
    padding-left: calc(1rem - 3px);
  }
  .data-mocker-badge {
    display: inline-flex;
    padding: 0.25rem 0.625rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
    background-color: #e0e7ff;
    color: #4338ca;
    letter-spacing: 0.025em;
  }
  .data-mocker-view, .data-mocker-delete {
    font-size: 0.875rem;
    color: #6b7280;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    border-radius: 0.375rem;
    cursor: pointer;
    opacity: 0;
    transition: all 0.15s;
    background-color: transparent;
    border: none;
  }
  .data-mocker-item:hover .data-mocker-view,
  .data-mocker-item:hover .data-mocker-delete {
    opacity: 1;
  }
  .data-mocker-view:hover {
    color: #4f46e5;
    background-color: #e0e7ff;
  }
  .data-mocker-delete {
    margin-left: 0.5rem;
  }
  .data-mocker-delete:hover {
    color: #dc2626;
    background-color: #fee2e2;
  }
  .data-mocker-pre-container {
    margin: 0 1.25rem 1.25rem 1.25rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .data-mocker-pre {
    padding: 1.25rem;
    overflow: auto;
    max-height: 24rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    color: #111827;
  }
  .data-mocker-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
    color: #6b7280;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    margin: 0 1.25rem;
  }
  .data-mocker-form {
    background-color: #f9fafb;
    padding: 1.25rem;
    border-radius: 0.5rem;
    margin: 0 1.25rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    border: 1px solid #e5e7eb;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  }
  .data-mocker-form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  .data-mocker-label {
    font-size: 0.875rem;
    font-weight: 500;
    color: #374151;
    display: flex;
    align-items: center;
  }
  .data-mocker-input, .data-mocker-textarea {
    width: 100%;
    padding: 0.625rem 0.875rem;
    border: 1px solid #d1d5db;
    border-radius: 0.375rem;
    font-size: 0.875rem;
    transition: all 0.15s;
    background-color: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }
  .data-mocker-input:focus, .data-mocker-textarea:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.2);
  }
  .data-mocker-input::placeholder, .data-mocker-textarea::placeholder {
    color: #9ca3af;
  }
  .data-mocker-textarea {
    min-height: 8rem;
    resize: none;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    line-height: 1.5;
  }
  .data-mocker-save {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.75rem 1.25rem;
    background: linear-gradient(135deg, #4f46e5, #3b82f6);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-weight: 500;
    font-size: 0.9375rem;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  }
  .data-mocker-save:hover {
    background: linear-gradient(135deg, #4338ca, #2563eb);
    transform: translateY(-1px);
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  }
  .data-mocker-save:active {
    transform: translateY(1px);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  .data-mocker-save svg {
    margin-right: 0.5rem;
  }
  .data-mocker-tab {
    padding: 0.625rem 1.25rem;
    color: #6b7280;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all 0.15s;
    font-weight: 500;
  }
  .data-mocker-tab:hover {
    color: #4f46e5;
  }
  .data-mocker-tab-active {
    color: #4f46e5;
    border-bottom-color: #4f46e5;
  }
  
  /* Ajout des classes utilitaires */
  .data-mocker-padding {
    padding: 1.25rem;
  }
  .data-mocker-hidden {
    display: none;
  }
  .data-mocker-flex {
    display: flex;
  }
  .data-mocker-items-center {
    align-items: center;
  }
  .data-mocker-justify-between {
    justify-content: space-between;
  }
  .data-mocker-flex-col {
    flex-direction: column;
  }
  .data-mocker-space-x-2 > * + * {
    margin-left: 0.5rem;
  }
  .data-mocker-space-y-2 > * + * {
    margin-top: 0.5rem;
  }
  .data-mocker-space-x-3 > * + * {
    margin-left: 0.75rem;
  }
  .data-mocker-gap-1 {
    gap: 0.25rem;
  }
  .data-mocker-gap-2 {
    gap: 0.5rem;
  }
  .data-mocker-w-full {
    width: 100%;
  }
  .data-mocker-h-5 {
    height: 1.25rem;
  }
  .data-mocker-w-5 {
    width: 1.25rem;
  }
  .data-mocker-h-16 {
    height: 4rem;
  }
  .data-mocker-w-16 {
    width: 4rem;
  }
  
  /* Marges */
  .data-mocker-m-1 {
    margin: 0.25rem;
  }
  .data-mocker-m-2 {
    margin: 0.5rem;
  }
  .data-mocker-m-4 {
    margin: 1rem;
  }
  .data-mocker-mx-1 {
    margin-left: 0.25rem;
    margin-right: 0.25rem;
  }
  .data-mocker-mx-2 {
    margin-left: 0.5rem;
    margin-right: 0.5rem;
  }
  .data-mocker-mx-4 {
    margin-left: 1rem;
    margin-right: 1rem;
  }
  .data-mocker-my-1 {
    margin-top: 0.25rem;
    margin-bottom: 0.25rem;
  }
  .data-mocker-my-2 {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .data-mocker-my-4 {
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  .data-mocker-mt-1 {
    margin-top: 0.25rem;
  }
  .data-mocker-mt-2 {
    margin-top: 0.5rem;
  }
  .data-mocker-mt-4 {
    margin-top: 1rem;
  }
  .data-mocker-mb-1 {
    margin-bottom: 0.25rem;
  }
  .data-mocker-mb-2 {
    margin-bottom: 0.5rem;
  }
  .data-mocker-mb-4 {
    margin-bottom: 1rem;
  }
  .data-mocker-ml-1 {
    margin-left: 0.25rem;
  }
  .data-mocker-ml-2 {
    margin-left: 0.5rem;
  }
  .data-mocker-ml-4 {
    margin-left: 1rem;
  }
  .data-mocker-mr-1 {
    margin-right: 0.25rem;
  }
  .data-mocker-mr-2 {
    margin-right: 0.5rem;
  }
  .data-mocker-mr-4 {
    margin-right: 1rem;
  }
  
  /* Paddings */
  .data-mocker-p-1 {
    padding: 0.25rem;
  }
  .data-mocker-p-2 {
    padding: 0.5rem;
  }
  .data-mocker-p-3 {
    padding: 0.75rem;
  }
  .data-mocker-p-4 {
    padding: 1rem;
  }
  .data-mocker-p-8 {
    padding: 2rem;
  }
  .data-mocker-px-1 {
    padding-left: 0.25rem;
    padding-right: 0.25rem;
  }
  .data-mocker-px-2 {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  .data-mocker-px-3 {
    padding-left: 0.75rem;
    padding-right: 0.75rem;
  }
  .data-mocker-px-4 {
    padding-left: 1rem;
    padding-right: 1rem;
  }
  .data-mocker-py-1 {
    padding-top: 0.25rem;
    padding-bottom: 0.25rem;
  }
  .data-mocker-py-2 {
    padding-top: 0.5rem;
    padding-bottom: 0.5rem;
  }
  .data-mocker-py-3 {
    padding-top: 0.75rem;
    padding-bottom: 0.75rem;
  }
  .data-mocker-py-4 {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }
  .data-mocker-pt-1 {
    padding-top: 0.25rem;
  }
  .data-mocker-pt-2 {
    padding-top: 0.5rem;
  }
  .data-mocker-pt-4 {
    padding-top: 1rem;
  }
  .data-mocker-pb-1 {
    padding-bottom: 0.25rem;
  }
  .data-mocker-pb-2 {
    padding-bottom: 0.5rem;
  }
  .data-mocker-pb-4 {
    padding-bottom: 1rem;
  }
  .data-mocker-pl-1 {
    padding-left: 0.25rem;
  }
  .data-mocker-pl-2 {
    padding-left: 0.5rem;
  }
  .data-mocker-pl-4 {
    padding-left: 1rem;
  }
  .data-mocker-pr-1 {
    padding-right: 0.25rem;
  }
  .data-mocker-pr-2 {
    padding-right: 0.5rem;
  }
  .data-mocker-pr-4 {
    padding-right: 1rem;
  }
  
  .data-mocker-border-b {
    border-bottom-width: 1px;
    border-bottom-style: solid;
  }
  .data-mocker-border-t {
    border-top-width: 1px;
    border-top-style: solid;
  }
  .data-mocker-border {
    border-width: 1px;
    border-style: solid;
  }
  .data-mocker-border-gray-200 {
    border-color: #e5e7eb;
  }
  .data-mocker-rounded-lg {
    border-radius: 0.5rem;
  }
  .data-mocker-rounded-full {
    border-radius: 9999px;
  }
  .data-mocker-overflow-hidden {
    overflow: hidden;
  }
  .data-mocker-max-h-64 {
    max-height: 16rem;
  }
  .data-mocker-max-h-96 {
    max-height: 24rem;
  }
  .data-mocker-text-sm {
    font-size: 0.875rem;
  }
  .data-mocker-text-xs {
    font-size: 0.75rem;
  }
  .data-mocker-font-medium {
    font-weight: 500;
  }
  .data-mocker-text-gray-700 {
    color: #374151;
  }
  .data-mocker-text-gray-500 {
    color: #6b7280;
  }
  .data-mocker-text-gray-400 {
    color: #9ca3af;
  }
  .data-mocker-text-blue-500 {
    color: #3b82f6;
  }
  .data-mocker-bg-white {
    background-color: white;
  }
  .data-mocker-bg-gray-50 {
    background-color: #f9fafb;
  }
  .data-mocker-bg-gray-100 {
    background-color: #f3f4f6;
  }
  .data-mocker-bg-gray-200 {
    background-color: #e5e7eb;
  }
  .data-mocker-hover-bg-blue-50:hover {
    background-color: #eff6ff;
  }
  .data-mocker-hover-bg-red-50:hover {
    background-color: #fef2f2;
  }
  .data-mocker-hover-text-blue-500:hover {
    color: #3b82f6;
  }
  .data-mocker-hover-text-red-500:hover {
    color: #ef4444;
  }
  .data-mocker-opacity-0 {
    opacity: 0;
  }
  .data-mocker-group-hover-opacity-100 {
    opacity: 0;
    transition: opacity 0.2s;
  }
  .data-mocker-item:hover .data-mocker-group-hover-opacity-100 {
    opacity: 1;
  }
  .data-mocker-relative {
    position: relative;
  }
  .data-mocker-text-center {
    text-align: center;
  }
  
  /* JSON Viewer Styles */
  .data-mocker-json-viewer {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.875rem;
    padding: 1.25rem;
    overflow: auto;
    max-height: 24rem;
    line-height: 1.5;
  }
  .data-mocker-json-key {
    color: #5850ec;
  }
  .data-mocker-json-string {
    color: #059669;
  }
  .data-mocker-json-number {
    color: #db6c00;
  }
  .data-mocker-json-boolean {
    color: #9061f9;
  }
  .data-mocker-json-null {
    color: #9ca3af;
    font-style: italic;
  }
  
  /* Dark Mode */
  @media (prefers-color-scheme: dark) {
    .data-mocker-widget {
      background-color: #1f2937;
      color: #f9fafb;
      border-color: rgba(255, 255, 255, 0.05);
    }
    .data-mocker-header {
      background: linear-gradient(135deg, #4338ca, #2563eb);
      border-bottom-color: rgba(255, 255, 255, 0.05);
    }
    .data-mocker-title, .data-mocker-subtitle {
      color: #f9fafb;
      border-color: #374151;
    }
    .data-mocker-item {
      background-color: #1f2937;
      border-color: #374151;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .data-mocker-item:hover {
      background-color: #2d3748;
      border-color: #4b5563;
    }
    .data-mocker-active-item {
      background-color: rgba(79, 70, 229, 0.15);
      border-left-color: #4f46e5;
    }
    .data-mocker-badge {
      background-color: rgba(79, 70, 229, 0.2);
      color: #a5b4fc;
    }
    .data-mocker-view:hover {
      background-color: rgba(79, 70, 229, 0.2);
    }
    .data-mocker-delete:hover {
      background-color: rgba(239, 68, 68, 0.2);
    }
    .data-mocker-pre-container {
      background-color: #111827;
      border-color: #374151;
      box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    .data-mocker-pre {
      color: #f9fafb;
    }
    .data-mocker-empty {
      background-color: #111827;
    }
    .data-mocker-form {
      background-color: #111827;
      border-color: #374151;
    }
    .data-mocker-label {
      color: #d1d5db;
    }
    .data-mocker-input, .data-mocker-textarea {
      background-color: #374151;
      border-color: #4b5563;
      color: #f9fafb;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    .data-mocker-input::placeholder, .data-mocker-textarea::placeholder {
      color: #6b7280;
    }
    .data-mocker-input:focus, .data-mocker-textarea:focus {
      border-color: #818cf8;
      box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.2);
    }
    .data-mocker-save {
      background: linear-gradient(135deg, #4338ca, #2563eb);
    }
    .data-mocker-save:hover {
      background: linear-gradient(135deg, #4f46e5, #3b82f6);
    }
    .data-mocker-border-gray-200 {
      border-color: #374151;
    }
    .data-mocker-text-gray-700 {
      color: #e5e7eb;
    }
    .data-mocker-text-gray-500 {
      color: #9ca3af;
    }
    .data-mocker-text-gray-400 {
      color: #d1d5db;
    }
    .data-mocker-bg-white {
      background-color: #1f2937;
    }
    .data-mocker-bg-gray-50 {
      background-color: #101827;
    }
    .data-mocker-bg-gray-100 {
      background-color: #111827;
    }
    .data-mocker-hover-bg-blue-50:hover {
      background-color: rgba(59, 130, 246, 0.1);
    }
    .data-mocker-hover-bg-red-50:hover {
      background-color: rgba(239, 68, 68, 0.1);
    }
    
    /* JSON Viewer Dark Mode */
    .data-mocker-json-key {
      color: #818cf8;
    }
    .data-mocker-json-string {
      color: #34d399;
    }
    .data-mocker-json-number {
      color: #fb923c;
    }
    .data-mocker-json-boolean {
      color: #c084fc;
    }
    .data-mocker-json-null {
      color: #9ca3af;
    }
  }
`;

export const baseClasses = {
  wrapper: "data-mocker-widget",
  header: "data-mocker-header",
  headerTitle: "data-mocker-header-title",
  toggleBtn: "data-mocker-toggle",
  closeBtn: "data-mocker-close",
  body: "data-mocker-body",
  title: "data-mocker-title", 
  subtitle: "data-mocker-subtitle", 
  list: "data-mocker-list",
  listItem: "data-mocker-item",
  activeItem: "data-mocker-active-item",
  badge: "data-mocker-badge",
  btnView: "data-mocker-view",
  btnDel: "data-mocker-delete",
  preContainer: "data-mocker-pre-container",
  pre: "data-mocker-pre",
  emptyState: "data-mocker-empty",
  form: "data-mocker-form",
  formGroup: "data-mocker-form-group",
  label: "data-mocker-label",
  input: "data-mocker-input",
  textarea: "data-mocker-textarea", 
  btnSave: "data-mocker-save",
  tab: "data-mocker-tab",
  tabActive: "data-mocker-tab-active",
  jsonViewer: "data-mocker-json-viewer",
  jsonKey: "data-mocker-json-key",
  jsonString: "data-mocker-json-string",
  jsonNumber: "data-mocker-json-number",
  jsonBoolean: "data-mocker-json-boolean",
  jsonNull: "data-mocker-json-null",
};
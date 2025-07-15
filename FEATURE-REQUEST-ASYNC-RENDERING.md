# Feature: Add Asynchronous Template Rendering

**Status:** Proposed

## 1. Summary

Introduce a new `render_template_async` function that reads and renders template files asynchronously, preventing the Node.js event loop from being blocked and improving performance in I/O-bound applications.

## 2. Problem & Motivation

Currently, the `render_template` function uses `fs.readFileSync`, which is a synchronous, blocking operation. In a server environment or any application handling concurrent operations, this can block the entire Node.js event loop while waiting for the file system. This leads to poor performance and reduced throughput, as the application cannot handle other tasks during the file read.

**User Story:** As a developer building a web server with Node.js, I want to render templates from files asynchronously so that my server remains responsive and can handle other incoming requests while file I/O operations are in progress.

## 3. Proposed Solution

The proposed solution is to introduce a new, non-breaking function to the public API.

- **API Changes:**
  - **New Function:** `render_template_async(basename, data, options)`
  - This function will have the same signature as the existing `render_template` but will return a `Promise` that resolves with the rendered HTML string or rejects with an error.
  - The existing synchronous `render_template` function will remain unchanged for backward compatibility.

- **Code Examples:**

  ```javascript
  const hbsr = require('hbsr');

  async function renderPage() {
    try {
      const data = { title: "Welcome" };
      const html = await hbsr.render_template_async('my-page', data);
      console.log(html);
    } catch (error) {
      console.error("Failed to render template:", error);
    }
  }

  renderPage();
  ```

- **Internal Changes:**
  - The new function will use `fs.promises.readFile` instead of `fs.readFileSync` for non-blocking file access.

## 4. Acceptance Criteria

- [ ] A new public function `render_template_async` is implemented and exported.
- [ ] The function correctly reads and renders a template file using promises (`async/await`).
- [ ] Unit tests are written for `render_template_async`, covering both successful rendering and error cases (e.g., template not found).
- [ ] Code coverage is maintained or improved.
- [ ] The `README.md` is updated to document the new `render_template_async` function, its usage, and its benefits.

## 5. Non-Goals (Out of Scope)

- This feature will not modify or deprecate the existing synchronous `render_template` function.
- It will not introduce asynchronous logic into the core `render` (string-based) function, which will remain synchronous.
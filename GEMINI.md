# Guidelines for working on Syllable Pitch Master V2

## 🚨 MANDATORY RULES 🚨

- **Always Run Tests**: You **MUST** run the available tests whenever you make any code changes, especially to `logic.js` or core functionality in `index.html`.
- **Add Tests for New Code**: New features or bug fixes **MUST** have new automated tests added to `tests/tests.html` or `tests/integration_tests.html`.

### How to Run Tests
Tests are pure client-side HTML files. To run them, satisfy the following:
1.  **Open in Browser**: Open the test files in a web browser to execute.
2.  **File List**:
    *   `tests/tests.html`: **Unit Tests** for shared business logic (Parsing, Pitch, Migrations).
    *   `tests/integration_tests.html`: **Integration Tests** (e.g. Autobackup, Mocked GAPI features).

---

## 📂 Project Structure

-   `index.html`: The main user interface and application view.
-   `logic.js`: Multi-language lyrics parsing, pitch accent calculation, migrations, and support functions.
-   `styles.css`: All application styling.
-   `tests/`: Location for automated unit and integration tests.
-   `temp/`: Scratchpad space for one-off research or issue reproductions.

---

## 🛠️ Local Development Guidelines

-   **Cloud Backup Testing**: Testing Google Drive integrations requires care due to GAPI Origin policies.
    -   While unit and integration tests use **mockeries**, full live tests of the authorization mechanics typically require a local HTTP web server.
    -   Use tools like `npx http-server` or `python3 -m http.server` instead of viewing via the `file://` protocol if live auth token validation fails.

---

## 💾 Core Logic & Safety

-   **Data Consistency**: Respect the `localStorage` payload signature and incremental model migrations in `logic.js`.
-   **Split/Join integrity**: When amending components for structural splits or joins of notes/syllables, verify the state bounds to avoid breaking lyrics rendering accurately.
-   **Accents and Markings**: Standard curves and visuals depend on continuous note integrity. Avoid breaking edge markers and dynamics triggers implicitly.

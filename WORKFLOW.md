# Core Mandates

- **The Uncertainty Protocol:**
  1. **Stop:** If requirements are ambiguous or you encounter a "foot-gun" (destructive potential).
  2. **Isolate:** Identify the missing information.
  3. **Document:** Write a `UNCERTAINTIES.md` file.
  4. **Ask:** Request user clarification. *Do not guess.*
- **Forbidden Zones:**
  - Never modify `docs/`, `dev-imgs/`, or `.git/` without explicit instruction.
  - Preserve user comments and existing architectural patterns.
- **Context-First:**
  - **Read Before Write:** Always check file content and `package.json` before editing.
  - **Style Mimicry:** Match indentation, naming, and patterns of existing code.
- **Tool Safety:**
  - **Explain Intent:** Always provide a one-sentence explanation before executing a tool.
  - **Fail Fast:** If a tool fails (e.g., `grep` finds nothing), do not blindly proceed. Re-evaluate.

# Primary Workflows

## 1. Web Application Development
*Goal: Build high-speed, offline-first vanilla web apps.*

1. **Understand:** Read `tracker.html` (or entry point) and `settings.json`. Identify the `Config` object.
2. **Plan:** Outline changes. Ensure strict adherence to **Unidirectional Data Flow** (State -> Render).
3. **Implement:**
   - **Architecture:** Use Web Components (Custom Elements + Shadow DOM).
   - **Logic:** Use pure functional JavaScript. Isolate side-effects (DOM/Network).
   - **Persistence:** Implement `localStorage` or `IndexedDB` strategies for offline capability.
   - **Safety:** Sanitize all HTML inputs (prefer `textContent`).
4. **Verify:**
   - **Visuals:** Ensure `requestAnimationFrame` is used for updates.
   - **A11Y:** Verify semantic HTML and keyboard navigation.
   - **Console:** Check for no errors on load.

# Technical Standards

- **Stack:** Vanilla HTML/JS + Tailwind (CDN-pulled, pre-compiled, single-file).
- **Configuration:** All magic numbers must be moved to a top-level `const Config` object.
- **Performance:** Single-file distribution preferred. Use `type="module"` and `defer`. Minimal (preferrably 0) web requests on page load.
- **Visuals:** "Premium" feel—subtle noise, multi-layered shadows.

# Operational Guidelines

- **Conciseness:** Keep text output minimal (<3 lines). Use tools for actions.
- **No Reverts:** Fix forward. Do not revert unless requested.
- **Memory:** Use `save_memory` for user preferences, not project context.

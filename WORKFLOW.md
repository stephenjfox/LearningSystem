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


## 2. General Workflow Management

### 1. Plan Mode Default
- Enter plan mode for ANY non-trivial task (3+ steps or architectural decisions)
- If something goes sideways, STOP and re-plan immediately – don't keep pushing
- Use plan mode for verification steps, not just building
- Write detailed specs upfront to reduce ambiguity

### 2. Subagent Strategy
- Use subagents liberally to keep main context window clean
- Offload research, exploration, and parallel analysis to subagents
- For complex problems, throw more compute at it via subagents
- One task per subagent for focused execution

### 3. Self-Improvement Loop
- After ANY correction from the user: update `tasks/lessons.md` with the pattern
- Write rules for yourself that prevent the same mistake
- Ruthlessly iterate on these lessons until mistake rate drops
- Review lessons at session start for relevant project

### 4. Verification Before Done
- Never mark a task complete without proving it works
- Diff behavior between main and your changes when relevant
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, demonstrate correctness

### 5. Demand Elegance (Balanced)
- For non-trivial changes: pause and ask "is there a more elegant way?"
- If a fix feels hacky: "Knowing everything I know now, implement the elegant solution"
- Skip this for simple, obvious fixes – don't over-engineer
- Challenge your own work before presenting it

### 6. Autonomous Bug Fixing
- When given a bug report: just fix it. Don't ask for hand-holding
- Point at logs, errors, failing tests – then resolve them
- Zero context switching required from the user
- Go fix failing CI tests without being told how

### 3. Task Management

1. **⚡Plan First⚡**: Write plan to `tasks/todo.md` with checkable items
2. **⚡Verify Plan⚡**: Check in before starting implementation
3. **⚡Track Progress⚡**: Mark items complete as you go
4. **⚡Explain Changes⚡**: High-level summary at each step
5. **⚡Document Results⚡**: Add review section to `tasks/todo.md`
6. **⚡Capture Lessons⚡**: Update `tasks/lessons.md` after corrections

### 4. Core Principles

- **⚡Simplicity First⚡**: Make every change as simple as possible. Impact minimal code.
- **⚡No Laziness⚡**: Find root causes. No temporary fixes. Senior developer standards.
- **⚡Minimal Impact⚡**: Changes should only touch what's necessary. Avoid introducing bugs.
- **If any contradiction is found**, defer to the more specific instruction.


# Technical Standards

- **Stack:** Vanilla HTML/JS + Tailwind (CDN-pulled, pre-compiled, single-file).
- **Configuration:** All magic numbers must be moved to a top-level `const Config` object.
- **Performance:** Single-file distribution preferred. Use `type="module"` and `defer`. Minimal (preferrably 0) web requests on page load.
- **Visuals:** "Premium" feel—subtle noise, multi-layered shadows.

# Operational Guidelines

- **Conciseness:** Keep text output minimal (<3 lines). Use tools for actions.
- **No Reverts:** Fix forward. Do not revert unless requested.
- **Memory:** Use `save_memory` for user preferences, not project context.

# MasteryTracker Agent Guide (AGENTS.md)

Welcome, Google Jules. This document provides the essential context, technical standards, and domain logic required to effectively contribute to the **MasteryTracker** project.

## 1. Project Overview
**MasteryTracker** is a specialized, high-speed, offline-first web application designed for medical students (specifically targeting Brown University's Warren Alpert Medical School). It implements a mathematically-driven learning system based on the **Harmonic Mean of Mastery**.

- **Core Goal:** Help users maximize their global mastery across all topics while penalizing neglect of weak areas.
- **Primary Artifact:** `tracker.html` (A self-contained, single-file web application).

## 2. Technical Stack & Architecture
This project follows a "No-Framework" philosophy to ensure longevity, speed, and zero-dependency portability.

- **Frontend:** Vanilla HTML5, CSS3, and modern JavaScript (ES6+).
- **Styling:** Tailwind CSS (via pre-compiled inline blocks, CDN-pulled).
- **Persistence:** `localStorage` (v2 schema: Block Architecture).
- **Architecture Pattern:**
  - **Single File:** The entire app (HTML/CSS/JS) lives in `tracker.html`.
  - **Unidirectional Data Flow:** State Update → `save()` → `render()`.
  - **Web Components:** Use Custom Elements + Shadow DOM for UI encapsulation when building complex widgets.
  - **Functional JS:** Favor pure functions and immutability for domain logic. Isolate side-effects (DOM/Storage) at the edges.

## 3. Domain Logic: The Learning System
Agents must understand the underlying mathematical models to modify the tracker's logic:

### A. The Mastery Optimization Function (MOF)
We use the **Harmonic Mean ($M_h$)** to calculate global mastery:
$$M_h = \frac{T}{\sum_{i=1}^{T} \frac{1}{M_i}}$$
- $T$: Total number of topics.
- $M_i$: Mastery score for topic $i$ (0-10 scale).
- **Implication:** The harmonic mean is extremely sensitive to low values ("Weakest Link" penalty). The system should always prioritize topics with the lowest $M_i$.

### B. The Three-Pass System
The application UI (specifically the "Walkthrough") reinforces a structured study workflow:
- **Pass 1 (Foundational):** Sequential mapping (15-20m).
- **Pass 2 (Stress-Test):** Dynamic modeling/regulatory layers (25-30m).
- **Pass 3 (Synthesis):** Clinical vignette generation from memory (10-15m).

## 4. Coding Standards & Guidelines
- **Configuration:** All magic numbers and constants must reside in a top-level `const Config` object (or the `state` object if persistent).
- **UI Updates:** Use `requestAnimationFrame` for complex visual transitions.
- **Safety:**
  - Never inject untrusted HTML.
  - Prefer `textContent` over `innerHTML` whenever possible.
  - Sanitize all user inputs before rendering.
- **Performance:** Maintain a "Premium" feel with subtle noise, multi-layered shadows, and minimal layout thrash.
- **Responsiveness:** Ensure all new features work on mobile (90dvh/100vw constraints).

## 5. Agent Workflow Protocols
- **Read Before Write:** Always analyze the existing functions in `tracker.html` before proposing changes.
- **Uncertainty Protocol:** If a requirement is ambiguous or risks data loss, **STOP** and ask for clarification.
- **Explain Intent:** Always provide a one-sentence explanation before executing a shell command or modification.
- **Style Mimicry:** Match the indentation, naming conventions (camelCase for JS, kebab-case for CSS classes), and architectural patterns of the existing codebase.

## 6. Key Files
- `tracker.html`: The entire application code.
- `changelog.md`: Record of all major features and bug fixes.
- `docs/Learning System Defined.md`: The philosophical and mathematical foundation of the app.
- `GEMINI.md` / `WORKFLOW.md`: Specific rules for development and AI behavior.

## 7. Build & Test
- **Build:** No build step is required. Changes to `tracker.html` are immediate.
- **Testing:** Manually verify UI changes by opening `tracker.html` in a browser. Ensure no console errors occur on load or during data export/import.

---
*Generated for Google Jules & Gemini CLI - January 2026*

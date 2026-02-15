# Changelog

## [Unreleased] - 2026-02-14

### Added
- **Smart Lecture Import:** Enhanced the Import Wizard to detect pre-tagged data.
    - Automatic mapping of `subject` and `topics` (plural) from JSON.
    - Intelligent topic matching: links to existing topics by name or registers new ones.
    - "Review Match-ups" UI: A streamlined second step for reviewing pre-tagged data instead of manual dropdown selection.
- **JSON Lecture Import Wizard:** A multi-step workflow for bulk importing lectures.
    - Step 1: JSON payload parsing.
    - Step 2: Interactive tagging UI with responsive Table (Desktop) and Card (Mobile) views.
    - Quick Actions bar for bulk subject/topic application.
    - Support for dynamic subject creation and pending topic registration.
    - Step 3: Final review of lectures and new topics.
- **Priority Maxing:** Refined priority triage logic to "Max" subjects with unmastered topics.
- **Mobile Navigation:**
    - Implemented a collapsible hamburger menu for mobile devices.
    - Added a slide-in sidebar drawer with a backdrop overlay.
    - Integrated automatic sidebar closing into the `switchView` workflow.

### Fixed
- **Mobile Ergonomics:** Repositioned hamburger menu to the left of the title for better reach on mobile devices.
- **CSS Robustness:** Fixed responsive utility shim for `.lg:hidden` to ensure correct visibility transitions when resizing browser.
- **UI Consistency:** Synchronized "Review Import" button styling with the global "Add Lecture" button for visual coherence.
- **Bug:** Fixed logic gap where the Batch Apply button in the Import Wizard could not find the target selects due to missing IDs.

## [Unreleased] - 2026-01-31

### Added
- **Walkthrough View Enhancements:**
    - Integrated a multi-mode JS timer widget (Stopwatch, Pomodoro, Mastery Sprint).
    - Deconstructed learning phases into interactive checklists with Bloom's Taxonomy badges.
    - Added detailed pedagogical guidance for Concept Deconstruction and Vignette Construction.
- **Modular Architecture:** Refactored the monolithic script into a modular Custom Element architecture (Light DOM).

## [Unreleased] - 2026-01-22

### Added
- **Log Lecture Tool:** Ability to record a pass for all topics associated with a specific lecture in one action.
- **Datetime Precision:** Switched date handling to `datetime-local` to improve sorting accuracy and support local timezones.

## [Unreleased] - 2026-01-17

### Added
- **Bulk Log Passes:** Implemented a 2-step modal for rapid scoring of multiple topics in a single session.
- **UI Responsiveness:** Optimized bulk log tables to fit comfortably on both mobile and desktop screens.

## [Unreleased] - 2026-01-08

### Added
- **Block Architecture:** Implemented a new "Block" paradigm to organize learning modules.
    - Added data migration logic to safely transition from v1 to v2 data structures.
    - Added a "Block Selector" dropdown in the header to switch contexts.
    - Added "All Blocks (Longitudinal)" view for global retention tracking.
    - Added "Add Block" modal and workflow.
    - Added "Rename Block" functionality with a pencil icon button.
- **Topic Enhancements:**
    - Added `#tags` support to topics.
    - Added an "Edit" button to topic list rows.
    - Added visual grouping by Block Name in the "All Blocks" view.
- **Search & Filtering:**
    - Added a global text search bar to the Lecture Catalog (filters by title, topic name, and tags).
- **Performance:**
    - Switched initialization from `window.onload` to `DOMContentLoaded` for faster perceived load times.
    - Optimized event delegation for all dynamic lists.

### Changed
- **Modal System:** Refactored to a robust "Smart Toggle" architecture.
    - Modals now auto-initialize title/buttons on open (Add vs. Edit).
    - Modals now auto-reset forms and hidden IDs on close.
- **UI/UX:**
    - Updated badges to visually indicate mastery level.
    - Hidden "Add" buttons when in Longitudinal view to prevent data errors.
    - Fixed tab switching logic.

### Fixed
- **Critical:** Restored missing `deleteTopic`, `deleteLecture`, and `deletePass` functions.
- **Critical:** Restored `renameActiveBlock` function which was causing ReferenceErrors.
- **Bug:** Fixed persistence of "Edit Topic" text when switching to "Add Topic" mode.
- **Bug:** Fixed HTML syntax error (missing `<select>` tag in filter bar).

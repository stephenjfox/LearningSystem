# Changelog

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
    - Implemented a "Retention Decay" (Rust) logic placeholder (currently shelved).
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
    - Fixed tab switching logic (`.nav-link` class mismatch).

### Fixed
- **Critical:** Restored missing `deleteTopic`, `deleteLecture`, and `deletePass` functions.
- **Critical:** Restored `renameActiveBlock` function which was causing ReferenceErrors.
- **Bug:** Fixed persistence of "Edit Topic" text when switching to "Add Topic" mode.
- **Bug:** Fixed HTML syntax error (missing `<select>` tag in filter bar).

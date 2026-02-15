# Implementation Plan: JSON Lecture Import Wizard

## Objective
Implement a multi-step wizard for bulk-importing lectures from JSON and mapping them to subjects and topics, as per the mockups in `dev-imgs/`.

## Architecture
- **Component:** `<lecture-import-view>` Custom Element.
- **Wizard State:** Internal state to track steps (1-4) and the working list of lectures to be imported.
- **Responsive Design:** 
    - Desktop: Table view with inline dropdowns.
    - Mobile: Card-based view with grouped controls.

## Wizard Steps
1. **Step 1: Data Input**
    - Large textarea for pasting JSON.
    - "Parse JSON" button.
    - Basic validation of the expected schema (`lecture_name`, `lecturer_name`, `start`, etc.).
        - The following should parse trivially: `{"lecture_name":"**ILM: Psychiatric & Psychopharmacologic Emergencies","lecturer_name":"Brannan & Halt","description":"","start":"2026-03-02T21:00:00+00:00","end":"2026-03-02T22:00:00+00:00","location":"N/A"}`

2. **Step 2: Tag Lectures (The Mockup Step)**
    - Progress bar showing % of lectures tagged.
    - **Quick Actions Bar:**
        - `Apply Subject to All`: Dropdown of unique subjects in current block + "New Subject...".
        - `Apply Topic to All`: Dropdown of topics in current block + "New Topic...".
        - `Select All` / `Apply to Selected`.
    - **Lecture List:**
        - Row/Card for each lecture.
        - Checkbox for batch operations.
        - Inline dropdowns for Subject and Topic.
        - "Topic" dropdown should include existing topics and a "Create New: [Lecture Name]" option.

3. **Step 3: Review & Confirm**
    - Show summary: "X new topics will be created", "Y lectures will be added to Block Z".
    - "Confirm Import" button.

4. **Step 4: Success**
    - Visual confirmation and button to "View Catalog".

## UI/UX Details (Mockup Alignment)
- Use the Indigo/Slate color palette from the mockups.
- Progress bar at the top with "Step X of 4".
- "Quick Actions" bar with the distinct purple background.
- Rounded corners and subtle shadows for cards.

## Tasks
- [ ] Scaffold `<lecture-import-view>` in `tracker.html`.
- [ ] Implement View Switching & Navigation link.
- [ ] Build Step 1 (JSON Parser).
- [ ] Build Step 2 Tagging Logic:
    - [ ] Desktop Table layout.
    - [ ] Mobile Card layout.
    - [ ] Quick Action implementations.
    - [ ] Subject/Topic mapping state management.
- [ ] Build Step 3 Review Screen.
- [ ] Implement State Persistence (Adding new topics and lectures to `localStorage`).
- [ ] Final polish & Verification.

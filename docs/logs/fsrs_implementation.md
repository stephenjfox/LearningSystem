# FSRS Implementation Log

## Mon Mar  9 19:16:07 EDT 2026 - Phase 1, 2, and 3 Completed

### Progress Made
1.  **Phase 1: Include FSRS Logic**
    *   Instead of putting it in a separate script file, I realized per the initial project constraints that this needs to remain a single-file application. I embedded the FSRS constants (`W` array) and core functions (`calculateRetrievability`, `updateStabilityOnSuccess`, `updateStabilityOnFailure`, `updateDifficulty`, `getInitialStability`, `getInitialDifficulty`, `initializeCard`, `reviewCard`) directly into a designated `// --- FSRS ALGORITHM ---` block at the top of the main `<script>` tag in `tracker.html`.
2.  **Phase 2: Add State and Toggle**
    *   Updated the `state` initialization to include `goals: { algorithm: 'classical' }`.
    *   Modified the `resetState` and migration block in `init()` to handle the new `goals` object.
    *   Updated the "Set Mastery Goal" modal (`#goal-modal`) to include a dropdown for selecting the algorithm (`classical` vs. `fsrs`).
    *   Wired up `openGoalModal` and `handleGoalSubmit` to read and write the selected algorithm, triggering a full state save and `render()`.
3.  **Phase 3: Enhance `getTopicStats`**
    *   Modified `getTopicStats(topicId)` to check `state.goals.algorithm`.
    *   If `fsrs`, it sorts the passes chronologically, computes a mock score `(0.7 * sp3) + (0.3 * quiz)`, translates that into a grade (1-4), and runs the FSRS `reviewCard` function iteratively across the history.
    *   Calculates the final elapsed days since the *last* pass to determine current retrievability.
    *   Returns the retrievability as a percentage (e.g., `85.4%`) so it plugs neatly into the `mi` property used by the rest of the app.
4.  **Phase 4: UI Adjustments for Percentage Metric (Partial)**
    *   Plumbed `isFSRS` boolean flag through the main `render()` function down into various components: `mastery-stats`, `priority-sidebar`, `view-dashboard` (TopicMasteryView), and `view-history` (PassHistoryView).
    *   Adjusted threshold logic: When in FSRS mode, "mastered" means >= 70.0% instead of >= 7.0. This was updated in the global stats calculation and the `calculatePriority` queue logic.
    *   Updated `PrioritySidebar` to display "Retrievability: X%" instead of "Mh: X".
    *   Updated `MasteryStats` to append a `%` sign when displaying the current mean and the target.
    *   Updated `TopicMasteryView` (`view-dashboard`) row rendering to append `%` and handle the 70.0 vs 7.0 color-coding threshold.
    *   Updated `PassHistoryView` (`view-history`) to change the column header to "Grade" instead of "Mi" when in FSRS mode, and render the specific grade the pass produced (1-4) instead of the classical intermediate Mi calculation.

### Next Steps / Phase 4 Continuation
Before proceeding further, I need to verify that all places displaying "Mi" or expecting a 0-10 scale handle the 0-100 percentage properly. Areas to check:
*   The "Walkthrough" or Help sections that might explicitly mention 0-10.
*   The `calculateMh` global function itself to see if it behaves weirdly when averaging large percentage numbers via harmonic mean vs the smaller 0-10 numbers. Since harmonic mean is just `n / sum(1/x)`, scaling `x` by 10 should naturally scale the result by 10, meaning it should mathematically work perfectly out of the box, but I should double check.
*   Ensure the tooltips or labels in the Modals (Bulk Log, Batch Exam) make sense regardless of the algorithm.

I am pausing here to await confirmation or further instructions.
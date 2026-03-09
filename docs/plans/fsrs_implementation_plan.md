# FSRS Integration Plan
**Date:** March 7, 2026, 04:10 PM EST

## Overview
This document details the plan for integrating the Free Spaced Repetition Scheduler (FSRS) algorithm into the Mastery Tracker. The goal is to calculate topic mastery as dynamic, decaying retrievability over time instead of static averages. A feature toggle will be introduced to switch between the "Classical" and "FSRS" models.

## Phase 1: Include FSRS Logic
- **Action:** Embed the core FSRS constants (`W`, `F`, `C`) and functions (`retrievability`, `initialStability`, `initialDifficulty`, `stabilityOnSuccess`, `stabilityOnFailure`, `updateDifficulty`, `reviewCard`, `initializeCard`) directly into `tracker.html` within a designated `// --- FSRS ALGORITHM ---` block.
- **Why:** The file acts as a standalone application without module bundlers, so all functions must be globally scoped or explicitly namespaced inside the script block.

## Phase 2: Add State and Toggle
- **Action:** 
  1. Add an `algorithm` field to `state.goals` (defaulting to `'classical'`).
  2. Implement a UI toggle (e.g., a simple switch or select element near the mastery goals) that updates `state.goals.algorithm` and triggers a full `render()`.
- **Why:** Enables A/B testing the old vs. new system and meets the requirement to treat this as an experimental feature toggle.

## Phase 3: Enhance `getTopicStats`
- **Action:** Modify `getTopicStats(topicId)` to fork its logic based on `state.goals.algorithm`.
  - **Classical Path:** Retain current logic (`(0.7 * avgSp3) + (0.3 * avgQuiz)`).
  - **FSRS Path:** 
    1. Fetch all passes for the topic and sort them chronologically by `date`.
    2. Convert pass scores into an FSRS "Grade" (1-4).
    3. Iterate through passes, feeding them into `reviewCard(card, grade, elapsedDays)` to build up `stability` and `difficulty`.
    4. Calculate the current `retrievability` based on elapsed days since the *last* pass and `Date.now()`.
    5. Return `mi: retrievability * 100` (so it outputs as a percentage, e.g., `85.4%`).
- **Why:** Centralizing the FSRS logic in `getTopicStats` ensures that `calculateMh` and `calculatePriority` inherit the new behaviors instantly, dynamically pushing forgotten topics to the top of the priority queue.

## Phase 4: UI Adjustments for Percentage Metric
- **Action:** 
  1. When FSRS is active, adjust formatting across UI components (e.g., `<mastery-stats>`, `<topic-mastery-view>`, and priorities list) to indicate percentages (e.g., adding a `%` sign, updating "out of 10" labels). 
  2. The target mastery logic must adapt: if classical target is `7.0`, its FSRS equivalent might be `70%`.
- **Why:** FSRS calculates retrievability as a probability (0.0 to 1.0). Transitioning this straight to a percentage is more intuitive than the pseudo 0-10 scale.


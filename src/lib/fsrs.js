// FSRS Constants and Core Functions
// Based on the Free Spaced Repetition Scheduler algorithm

const FSRS_W = [0.4, 0.6, 2.4, 5.8, 4.93, 0.94, 0.86, 0.01, 1.49, 0.14, 0.94, 2.18, 0.05, 0.34, 1.26, 0.29, 2.61];

// FSRS State: { stability, difficulty }
function getInitialStability(grade) {
    return FSRS_W[grade - 1];
}

function getInitialDifficulty(grade) {
    return Math.min(10, Math.max(1, FSRS_W[4] - Math.exp(FSRS_W[5] * (grade - 3))));
}

function calculateRetrievability(stability, elapsedDays) {
    if (stability === 0) return 0;
    return Math.pow(1 + FSRS_W[8] * elapsedDays / (9 * stability), -1);
}

function updateStabilityOnSuccess(stability, difficulty, retrievability, grade) {
    const s = stability;
    const d = difficulty;
    const r = retrievability;
    
    // Simplification for illustrative purposes - typical FSRS uses more complex weights
    return s * (1 + Math.exp(FSRS_W[6]) * (11 - d) * Math.pow(s, -FSRS_W[7]) * (Math.exp((1 - r) * FSRS_W[8]) - 1));
}

function updateStabilityOnFailure(stability, difficulty, retrievability) {
    return Math.min(stability, FSRS_W[15] * Math.pow(difficulty, -FSRS_W[16]) * Math.pow(stability, FSRS_W[15]));
}

function updateDifficulty(difficulty, grade) {
    const nextD = difficulty - FSRS_W[9] * (grade - 3);
    return Math.min(10, Math.max(1, FSRS_W[10] * 1 + (1 - FSRS_W[10]) * nextD));
}

function reviewCard(card, grade, elapsedDays) {
    let { stability, difficulty } = card;
    
    if (grade > 2) {
        const r = calculateRetrievability(stability, elapsedDays);
        stability = updateStabilityOnSuccess(stability, difficulty, r, grade);
        difficulty = updateDifficulty(difficulty, grade);
    } else {
        stability = updateStabilityOnFailure(stability, difficulty, calculateRetrievability(stability, elapsedDays));
    }
    
    return { stability, difficulty };
}

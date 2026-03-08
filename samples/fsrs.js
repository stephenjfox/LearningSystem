/**
 * Contained herein is example code that could serve as the foundation for FSRS logic being implemented in the mastery tracker.
 * An agent or team thereof should be tasked with integrating this into the app as an alternative mastery system.
 */

// FSRS-5 parameters (19 weights from the trained model)
const W = [
  0.40255, 1.18385, 3.173, 15.69105, 7.1949, 0.5345, 1.4604, 0.0046, 
  1.54575, 0.1192, 1.01925, 1.9395, 0.11, 0.29605, 2.2698, 0.2315, 
  2.9898, 0.51655, 0.6621
];

const F = 19.0 / 81.0;  // Forgetting curve factor
const C = -0.5;         // Forgetting curve exponent

// Grades: 1=Again, 2=Hard, 3=Good, 4=Easy

// Calculate retrievability given elapsed days and stability
function retrievability(elapsedDays, stability) {
  return Math.pow(1.0 + F * (elapsedDays / stability), C);
}

// Calculate next review interval given desired retention and stability
function nextInterval(desiredRetention, stability) {
  return (stability / F) * (Math.pow(desiredRetention, 1.0 / C) - 1.0);
}

// Initial stability after first review
function initialStability(grade) {
  return W[grade - 1];  // W[0] for Again, W[3] for Easy
}

// Initial difficulty after first review
function initialDifficulty(grade) {
  const g = grade;
  const d = W[4] - Math.exp(W[5] * (g - 1.0)) + 1.0;
  return Math.max(1.0, Math.min(10.0, d));
}

// Update stability on successful review (Hard/Good/Easy)
function stabilityOnSuccess(difficulty, stability, retrievability, grade) {
  const t_d = 11.0 - difficulty;
  const t_s = Math.pow(stability, -W[9]);
  const t_r = Math.exp(W[10] * (1.0 - retrievability)) - 1.0;
  const h = (grade === 2) ? W[15] : 1.0;  // Hard penalty
  const b = (grade === 4) ? W[16] : 1.0;  // Easy bonus
  const c = Math.exp(W[8]);
  const alpha = 1.0 + t_d * t_s * t_r * h * b * c;
  return stability * alpha;
}

// Update stability on failure (Again)
function stabilityOnFailure(difficulty, stability, retrievability) {
  const d_f = Math.pow(difficulty, -W[12]);
  const s_f = Math.pow(stability + 1.0, W[13]) - 1.0;
  const r_f = Math.exp(W[14] * (1.0 - retrievability));
  const c_f = W[11];
  const s_new = d_f * s_f * r_f * c_f;
  return Math.min(s_new, stability);
}

// Update difficulty
function updateDifficulty(difficulty, grade) {
  const deltaD = -W[6] * (grade - 3.0);
  const d_prime = difficulty + deltaD * ((10.0 - difficulty) / 9.0);
  const d0_easy = initialDifficulty(4);
  const d_new = W[7] * d0_easy + (1.0 - W[7]) * d_prime;
  return Math.max(1.0, Math.min(10.0, d_new));
}

// Main review function - call this when user reviews a card
function reviewCard(card, grade, elapsedDays, desiredRetention = 0.9) {
  // card = { stability, difficulty, lastReviewDate, ... }
  
  const r = retrievability(elapsedDays, card.stability);
  
  // Update stability
  if (grade === 1) {
    card.stability = stabilityOnFailure(card.difficulty, card.stability, r);
  } else {
    card.stability = stabilityOnSuccess(card.difficulty, card.stability, r, grade);
  }
  
  // Update difficulty
  card.difficulty = updateDifficulty(card.difficulty, grade);
  
  // Calculate next interval
  const interval = Math.max(1, Math.round(nextInterval(desiredRetention, card.stability)));
  
  return {
    nextInterval: interval,
    retrievability: r,
    stability: card.stability,
    difficulty: card.difficulty
  };
}

// Initialize a new card after first review
function initializeCard(grade) {
  return {
    stability: initialStability(grade),
    difficulty: initialDifficulty(grade),
    lastReviewDate: new Date()
  };
}

/**
 * Example usage outside of the app
 */
// First review: user got it "Good" (grade 3)
let card = initializeCard(3);
// card.stability ≈ 3.17 days, card.difficulty ≈ 7.19

// 3 days later, user reviews again and hits "Again" (grade 1)
let result = reviewCard(card, 1, 3);  
// retrievability ≈ 0.78 (78% recall probability at day 3)
// Next interval shortened due to failure

// Check if card is due without reviewing (for dashboard display)
function getRetrievabilityNow(card) {
  const elapsed = (Date.now() - card.lastReviewDate) / (1000 * 60 * 60 * 24);
  return retrievability(elapsed, card.stability);
}

// "Mastery" decay over time - this is your diminishing mastery metric
function currentMastery(card) {
  return getRetrievabilityNow(card);  // 0.0 to 1.0 probability
}


/**
 * Assumed mapping to the FSRS-compatible system
 */
// Initialize FSRS card from your existing data
function migrateToFSRS(existing) {
  // Convert 0-10 score to 1-4 grade
  const score = existing.score;
  const grade = score <= 2.5 ? 1 : 
                score <= 5.0 ? 2 : 
                score <= 7.5 ? 3 : 4;
  
  // Map difficulty (assuming your 0-10 → FSRS 1-10)
  const difficulty = Math.max(1, Math.min(10, existing.difficulty));
  
  // Calculate days since last review
  const elapsedDays = (Date.now() - new Date(existing.lastRetrieved)) / (1000*60*60*24);
  
  // Initialize FSRS card
  let card = {
    stability: initialStability(grade),      // From FSRS initializer
    difficulty: difficulty,                   // Carried over
    lastReviewDate: new Date(existing.lastRetrieved),
    reps: 1  // Assume at least one review
  };
  
  // Optional: If you have >1 review history, use the weighted mastery 
  // to heuristic-seed a stability adjustment
  if (existing.weightedMastery < 5) {
    // User was struggling - penalize initial stability
    card.stability *= 0.7;
  }
  
  return card;
}

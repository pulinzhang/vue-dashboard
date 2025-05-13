// Generate sample triplets
const generateTriplets = () => {
    const triplets = [];
    const genderOptions = [0, 1]; // 0 for male, 1 for female
    const scoreRange = { min: 60, max: 95 }; // Reasonable score range

    for (let i = 1; i <= 100; i++) {
        const individualGender = genderOptions[Math.floor(Math.random() * genderOptions.length)];
        const individualScore = Math.floor(Math.random() * (scoreRange.max - scoreRange.min + 1)) + scoreRange.min;
        
        // Generate pair score that's higher than individual scores
        const pairScore = individualScore + Math.floor(Math.random() * 30) + 20;
        
        triplets.push({
            id: `t${i}`,
            individual: {
                id: `i${i}`,
                gender: individualGender,
                score: individualScore
            },
            pair: {
                score: pairScore,
                genderCombination: "mixed"
            }
        });
    }
    return triplets;
};

// Generate sample singles
const generateSingles = () => {
    const singles = [];
    const genderOptions = [0, 1];
    const scoreRange = { min: 60, max: 95 };

    for (let i = 1; i <= 100; i++) {
        singles.push({
            id: `s${i}`,
            gender: genderOptions[Math.floor(Math.random() * genderOptions.length)],
            score: Math.floor(Math.random() * (scoreRange.max - scoreRange.min + 1)) + scoreRange.min
        });
    }
    return singles;
};

// Generate sample pairs
const generatePairs = () => {
    const pairs = [];
    const scoreRange = { min: 60, max: 95 };

    for (let i = 1; i <= 50; i++) {
        const member1Score = Math.floor(Math.random() * (scoreRange.max - scoreRange.min + 1)) + scoreRange.min;
        const member2Score = Math.floor(Math.random() * (scoreRange.max - scoreRange.min + 1)) + scoreRange.min;
        
        pairs.push({
            id: `p${i}`,
            members: [
                { id: `m${i*2-1}`, gender: 0, score: member1Score },
                { id: `m${i*2}`, gender: 1, score: member2Score }
            ],
            pairScore: member1Score + member2Score
        });
    }
    return pairs;
};

// Original Triplets
// const originalTripletsSample = [
//     {
//         id: "t1",
//         individual: { gender: 0, score: 85, id: "i1" },
//         pair: { score: 150, genderCombination: "mixed" }
//     },
//     // ... 99 more triplets
// ];
const originalTripletsSample = generateTriplets();

// New Participants
const newParticipantsSample = {
    // singles: [ // 100 individuals
    //     { id: "s1", gender: 0, score: 85 },
    //     // ...
    // ],
    // pairs: [ // 50 pairs (100 people)
    //     {
    //         id: "p1",
    //         members: [
    //             { id: "m1", gender: 0, score: 70 },
    //             { id: "m2", gender: 1, score: 80 }
    //         ],
    //         pairScore: 150
    //     },
    //     // ...
    // ]
    singles: generateSingles(),
    pairs: generatePairs()
};

/**
 * Calculate pair score based on individual scores and other factors
 * This implements the complex procedure for defining pair scores
 * 
 * Scoring Rules:
 * 1. Base score: Sum of individual scores
 * 2. Mixed gender bonus: +5 points if genders are different
 * 3. Score difference penalty: -0.5 points for each point of difference if gap > 10
 * 
 * Example:
 * - p1: score=80, gender=0
 * - p2: score=85, gender=1
 * - Base score: 80 + 85 = 165
 * - Mixed gender bonus: +5
 * - Score difference: |80-85| = 5 (no penalty)
 * - Final score: 170
 * 
 * @param {Object} p1 - First participant with {id, gender, score}
 * @param {Object} p2 - Second participant with {id, gender, score}
 * @returns {number} Calculated pair score with bonuses and penalties
 */
const calculatePairScore = (p1, p2) => {
    // Base score is the sum of individual scores
    let score = p1.score + p2.score;
    
    // Bonus for mixed gender pairs (5 points)
    // This encourages diverse gender combinations
    if (p1.gender !== p2.gender) {
        score += 5;
    }
    
    // Penalty for large score differences
    // Reduces score by half of the difference if gap > 10
    // This discourages pairing participants with very different skill levels
    const scoreDiff = Math.abs(p1.score - p2.score);
    if (scoreDiff > 10) {
        score -= Math.floor(scoreDiff / 2);
    }
    
    return score;
};

/**
 * Main matching algorithm for triplets
 * 
 * Key Requirements:
 * 1. Match 100 triplets from original data to new participants
 * 2. Each triplet consists of:
 *    - One individual (score + gender)
 *    - One pair (mixed gender + combined score)
 * 3. New data contains:
 *    - ~100 individual participants
 *    - ~100 paired participants (50 pairs)
 * 
 * Matching Priorities:
 * 1. Match quality (individual score, gender, pair score)
 * 2. Maximize number of matches
 * 3. Allow 10-20 unmatched individuals
 * 
 * Algorithm Overview:
 * 1. Create pair score universe (all possible combinations)
 * 2. First pass: Find high-quality matches with strict criteria
 * 3. Second pass: Find matches with relaxed criteria
 * 4. Calculate and return statistics
 * 
 * @param {Array} originalTriplets - Array of 100 original triplets
 * @param {Object} newParticipants - Object containing singles and pairs
 * @returns {Object} Matching results with statistics
 */
export const matchTriplets = (originalTriplets, newParticipants) => {
    // Create universe of all possible pair scores (100x100 combinations)
    // This precomputes all possible pairings between individual participants
    // Structure: Map<scoreKey, Array<{members, score, isMixedGender, scoreDiff}>>
    const pairScoreUniverse = new Map();
    newParticipants.singles.forEach((p1) => {
        newParticipants.singles.forEach((p2) => {
            if (p1.id !== p2.id) {
                const pairScore = calculatePairScore(p1, p2);
                // Use sorted scores as key to avoid duplicate entries
                const key = `${p1.score},${p2.score}`;
                if (!pairScoreUniverse.has(key)) {
                    pairScoreUniverse.set(key, []);
                }
                pairScoreUniverse.get(key).push({
                    members: [p1, p2],
                    score: pairScore,
                    isMixedGender: p1.gender !== p2.gender,
                    scoreDiff: Math.abs(p1.score - p2.score)
                });
            }
        });
    });

    // Tracking variables for the matching process
    const matchedTriplets = [];      // Stores successful matches with quality scores
    const usedSingles = new Set();   // Tracks used individual participants to prevent reuse
    const usedPairs = new Set();     // Tracks used pairs to prevent reuse
    const matchQuality = [];         // Stores quality metrics for each match

    // First pass: High-quality matches
    // Tries to find matches with small score differences (≤5 for singles, ≤10 for pairs)
    // This ensures we get the best possible matches first
    originalTriplets.forEach((triplet) => {
        // Find matching single with strict criteria
        // 1. Not already used
        // 2. Same gender
        // 3. Score difference ≤ 5
        const potentialSingles = newParticipants.singles
            .filter(s => !usedSingles.has(s.id))  // Not already used
            .map(s => ({
                single: s,
                scoreDiff: Math.abs(s.score - triplet.individual.score),
                genderMatch: s.gender === triplet.individual.gender
            }))
            .sort((a, b) => {
                // Prioritize gender match, then score difference
                if (a.genderMatch !== b.genderMatch) return b.genderMatch - a.genderMatch;
                return a.scoreDiff - b.scoreDiff;
            });

        // Only proceed if we have a good single match (score diff ≤ 5)
        if (potentialSingles.length > 0 && potentialSingles[0].scoreDiff <= 5) {
            const bestSingle = potentialSingles[0].single;
            
            // Find matching pair with strict criteria
            // 1. Mixed gender
            // 2. Members not used
            // 3. Score difference ≤ 10
            const potentialPairs = Array.from(pairScoreUniverse.values())
                .flat()
                .filter(p => 
                    p.isMixedGender &&                                    // Must be mixed gender
                    !p.members.some(m => usedSingles.has(m.id)) &&        // Members not used
                    Math.abs(p.score - triplet.pair.score) <= 10          // Score diff ≤ 10
                )
                .map(p => ({
                    pair: p,
                    scoreDiff: Math.abs(p.score - triplet.pair.score)
                }))
                .sort((a, b) => a.scoreDiff - b.scoreDiff);

            // Only proceed if we have a good pair match (score diff ≤ 10)
            if (potentialPairs.length > 0 && potentialPairs[0].scoreDiff <= 10) {
                const bestPair = potentialPairs[0].pair;
                usedSingles.add(bestSingle.id);
                bestPair.members.forEach(m => usedSingles.add(m.id));

                // Calculate quality scores (normalized to 0-1 range)
                // Single quality: 1 - (scoreDiff/20) for diff ≤ 5
                // Pair quality: 1 - (scoreDiff/20) for diff ≤ 10
                const singleQuality = 1 - (potentialSingles[0].scoreDiff / 20);  // Normalized to 5 points
                const pairQuality = 1 - (potentialPairs[0].scoreDiff / 20);      // Normalized to 10 points
                const qualityScore = (singleQuality + pairQuality) / 2;

                // Record the match with all relevant information
                matchedTriplets.push({
                    originalTripletId: triplet.id,
                    newSingle: bestSingle,
                    newPair: {
                        id: `p${bestPair.members[0].id}-${bestPair.members[1].id}`,
                        members: bestPair.members,
                        pairScore: bestPair.score
                    },
                    qualityScore
                });

                // Record quality metrics for statistics
                matchQuality.push({
                    tripletId: triplet.id,
                    singleQuality,
                    pairQuality,
                    overallQuality: qualityScore
                });
            }
        }
    });

    // Second pass: Less strict matches
    // Tries to find matches with larger score differences (≤15 for singles, ≤20 for pairs)
    // This helps maximize the number of matches while maintaining reasonable quality
    const remainingTriplets = originalTriplets.filter(
        t => !matchedTriplets.some(m => m.originalTripletId === t.id)
    );

    remainingTriplets.forEach((triplet) => {
        // Similar logic to first pass but with relaxed criteria
        // 1. Score difference ≤ 15 for singles
        // 2. Score difference ≤ 20 for pairs
        const potentialSingles = newParticipants.singles
            .filter(s => !usedSingles.has(s.id))
            .map(s => ({
                single: s,
                scoreDiff: Math.abs(s.score - triplet.individual.score),
                genderMatch: s.gender === triplet.individual.gender
            }))
            .sort((a, b) => {
                if (a.genderMatch !== b.genderMatch) return b.genderMatch - a.genderMatch;
                return a.scoreDiff - b.scoreDiff;
            });

        // Relaxed criteria for singles (score diff ≤ 15)
        if (potentialSingles.length > 0 && potentialSingles[0].scoreDiff <= 15) {
            const bestSingle = potentialSingles[0].single;
            
            const potentialPairs = Array.from(pairScoreUniverse.values())
                .flat()
                .filter(p => 
                    p.isMixedGender &&
                    !p.members.some(m => usedSingles.has(m.id)) &&
                    Math.abs(p.score - triplet.pair.score) <= 20  // Relaxed criteria
                )
                .map(p => ({
                    pair: p,
                    scoreDiff: Math.abs(p.score - triplet.pair.score)
                }))
                .sort((a, b) => a.scoreDiff - b.scoreDiff);

            // Relaxed criteria for pairs (score diff ≤ 20)
            if (potentialPairs.length > 0 && potentialPairs[0].scoreDiff <= 20) {
                const bestPair = potentialPairs[0].pair;
                usedSingles.add(bestSingle.id);
                bestPair.members.forEach(m => usedSingles.add(m.id));

                // Calculate quality scores with relaxed normalization
                // Single quality: 1 - (scoreDiff/30) for diff ≤ 15
                // Pair quality: 1 - (scoreDiff/40) for diff ≤ 20
                const singleQuality = 1 - (potentialSingles[0].scoreDiff / 30);  // Normalized to 15 points
                const pairQuality = 1 - (potentialPairs[0].scoreDiff / 40);      // Normalized to 20 points
                const qualityScore = (singleQuality + pairQuality) / 2;

                matchedTriplets.push({
                    originalTripletId: triplet.id,
                    newSingle: bestSingle,
                    newPair: {
                        id: `p${bestPair.members[0].id}-${bestPair.members[1].id}`,
                        members: bestPair.members,
                        pairScore: bestPair.score
                    },
                    qualityScore
                });

                matchQuality.push({
                    tripletId: triplet.id,
                    singleQuality,
                    pairQuality,
                    overallQuality: qualityScore
                });
            }
        }
    });

    // Calculate and return comprehensive statistics
    const totalSingles = newParticipants.singles.length;
    const totalPairs = newParticipants.pairs.length;
    const matchedSingles = usedSingles.size;
    const matchedPairs = matchedTriplets.length;
    const averageQuality = matchQuality.reduce((sum, m) => sum + m.overallQuality, 0) / matchQuality.length;

    return {
        matchedTriplets,
        unmatchedSingles: newParticipants.singles.filter(s => !usedSingles.has(s.id)),
        unmatchedPairs: newParticipants.pairs.filter(p => !usedPairs.has(p.id)),
        statistics: {
            totalSingles,
            totalPairs,
            matchedSingles,
            matchedPairs,
            matchRate: {
                singles: (matchedSingles / totalSingles * 100).toFixed(2) + '%',
                pairs: (matchedPairs / totalPairs * 100).toFixed(2) + '%'
            },
            averageQuality: averageQuality.toFixed(3),
            qualityDistribution: {
                high: matchQuality.filter(m => m.overallQuality > 0.8).length,
                medium: matchQuality.filter(m => m.overallQuality > 0.5 && m.overallQuality <= 0.8).length,
                low: matchQuality.filter(m => m.overallQuality <= 0.5).length
            },
            exactMatches: matchQuality.filter(m => m.overallQuality === 1.0).length
        }
    };
};

// Export sample data for testing
export const sampleData = {
    originalTriplets: originalTripletsSample,
    newParticipants: newParticipantsSample
};
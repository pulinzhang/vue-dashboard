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
 * Matches triplets with new participants based on gender and score criteria
 * @param {Array} originalTriplets - Array of original triplets to match
 * @param {Object} newParticipants - Object containing singles and pairs to match with
 * @returns {Array} Array of matched triplets
 */
export const matchTriplets = (originalTriplets, newParticipants) => {
    // Precompute all possible pair scores
    const pairScoreMatrix = {};
    newParticipants.singles.forEach((p1) => {
        newParticipants.singles.forEach((p2) => {
            if (p1.id !== p2.id) {
                const score = p1.score + p2.score;
                const key = `${p1.score},${p2.score}`;
                pairScoreMatrix[key] = score;
            }
        });
    });

    const matchedTriplets = [];
    const usedSingles = new Set();
    const usedPairs = new Set();

    originalTriplets.forEach((triplet) => {
        const matchedSingle = newParticipants.singles.find(
            (s) =>
                !usedSingles.has(s.id) &&
                s.gender === triplet.individual.gender &&
                s.score === triplet.individual.score
        );

        if (matchedSingle) {
            usedSingles.add(matchedSingle.id);

            const matchedPair = newParticipants.pairs.find(
                (p) =>
                    !usedPairs.has(p.id) &&
                    p.pairScore === triplet.pair.score &&
                    p.members[0].gender !== p.members[1].gender
            );

            if (matchedPair) {
                usedPairs.add(matchedPair.id);
                matchedTriplets.push({
                    originalTripletId: triplet.id,
                    newSingle: matchedSingle,
                    newPair: matchedPair
                });
            }
        }
    });

    return {
        matchedTriplets,
        unmatchedSingles: newParticipants.singles.filter((s) => !usedSingles.has(s.id)),
        unmatchedPairs: newParticipants.pairs.filter((p) => !usedPairs.has(p.id))
    };
};

// Export sample data for testing
export const sampleData = {
    originalTriplets: originalTripletsSample,
    newParticipants: newParticipantsSample
};
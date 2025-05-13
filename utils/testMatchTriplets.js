import { matchTriplets, sampleData } from './matchTripletsUtil.js';

// Run the matching algorithm
const result = matchTriplets(sampleData.originalTriplets, sampleData.newParticipants);

// Print detailed results
console.log('\n=== Matching Results ===');
console.log(`Total Matched Triplets: ${result.matchedTriplets.length}`);

// Print matched triplets details
console.log('\n=== Matched Triplets Details ===');
result.matchedTriplets.forEach((match, index) => {
    console.log(`\nMatch #${index + 1}:`);
    console.log(`Original Triplet ID: ${match.originalTripletId}`);
    console.log('Matched Single:', {
        id: match.newSingle.id,
        gender: match.newSingle.gender,
        score: match.newSingle.score
    });
    console.log('Matched Pair:', {
        id: match.newPair.id,
        members: match.newPair.members.map(m => ({
            id: m.id,
            gender: m.gender,
            score: m.score
        })),
        pairScore: match.newPair.pairScore
    });
});

// Print unmatched statistics
console.log('\n=== Unmatched Statistics ===');
console.log(`Unmatched Singles: ${result.unmatchedSingles.length}`);
console.log(`Unmatched Pairs: ${result.unmatchedPairs.length}`);

// Print some sample unmatched singles
console.log('\n=== Sample Unmatched Singles ===');
result.unmatchedSingles.slice(0, 5).forEach(single => {
    console.log({
        id: single.id,
        gender: single.gender,
        score: single.score
    });
});

// Print some sample unmatched pairs
console.log('\n=== Sample Unmatched Pairs ===');
result.unmatchedPairs.slice(0, 5).forEach(pair => {
    console.log({
        id: pair.id,
        members: pair.members.map(m => ({
            id: m.id,
            gender: m.gender,
            score: m.score
        })),
        pairScore: pair.pairScore
    });
}); 
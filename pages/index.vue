<template>
  <div class="container">
    <h1>Welcome to Vue Dashboard</h1>
    <p>2024 Budget and Sales Analysis</p>
    <BudgetChart />
    <RegionPieChart />
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Matching Algorithm Test Results</h1>
      
      <div v-if="matchingResults" class="space-y-6">
        <!-- Summary Section -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-2">Matching Summary</h2>
          <p>Total Matched Triplets: {{ matchingResults.matchedTriplets.length }}</p>
          <p>Unmatched Singles: {{ matchingResults.unmatchedSingles.length }}</p>
          <p>Unmatched Pairs: {{ matchingResults.unmatchedPairs.length }}</p>
        </div>

        <!-- Matched Triplets Section -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-2">Matched Triplets</h2>
          <div v-for="(match, index) in matchingResults.matchedTriplets" :key="index" class="mb-4 p-3 border rounded">
            <h3 class="font-medium">Match #{{ index + 1 }}</h3>
            <p>Original Triplet ID: {{ match.originalTripletId }}</p>
            <div class="mt-2">
              <h4 class="font-medium">Matched Single:</h4>
              <p>ID: {{ match.newSingle.id }}</p>
              <p>Gender: {{ match.newSingle.gender }}</p>
              <p>Score: {{ match.newSingle.score }}</p>
            </div>
            <div class="mt-2">
              <h4 class="font-medium">Matched Pair:</h4>
              <p>Pair ID: {{ match.newPair.id }}</p>
              <p>Pair Score: {{ match.newPair.pairScore }}</p>
              <div class="ml-4">
                <p v-for="member in match.newPair.members" :key="member.id">
                  Member {{ member.id }}: Gender {{ member.gender }}, Score {{ member.score }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Unmatched Singles Section -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-2">Sample Unmatched Singles</h2>
          <div v-for="single in matchingResults.unmatchedSingles.slice(0, 5)" :key="single.id" class="mb-2">
            <p>ID: {{ single.id }}, Gender: {{ single.gender }}, Score: {{ single.score }}</p>
          </div>
        </div>

        <!-- Unmatched Pairs Section -->
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-2">Sample Unmatched Pairs</h2>
          <div v-for="pair in matchingResults.unmatchedPairs.slice(0, 5)" :key="pair.id" class="mb-4">
            <p>Pair ID: {{ pair.id }}, Score: {{ pair.pairScore }}</p>
            <div class="ml-4">
              <p v-for="member in pair.members" :key="member.id">
                Member {{ member.id }}: Gender {{ member.gender }}, Score {{ member.score }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.vue';
import { ref, onMounted } from 'vue';
import { matchTriplets, sampleData } from '../utils/matchTripletsUtil';

const matchingResults = ref(null);

const runMatchingTest = () => {
  const result = matchTriplets(sampleData.originalTriplets, sampleData.newParticipants);
  matchingResults.value = result;
};

onMounted(() => {
  runMatchingTest();
});
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
  text-align: center;
}

p {
  color: #666;
  text-align: center;
  margin-bottom: 2rem;
}
</style> 
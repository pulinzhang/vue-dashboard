<template>
  <div class="min-h-screen bg-gray-50">
    <div class="container">
      <h1>Welcome to Vue Dashboard</h1>
      <p>2024 Budget and Sales Analysis</p>
      <BudgetChart />
      <RegionPieChart />

      <!-- Matching Results Section -->
      <div class="bg-white rounded-lg shadow-sm mt-8">
        <div class="px-4 py-5 sm:p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">Matching Algorithm Results</h2>
          
          <!-- Summary Cards -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-blue-50 rounded-lg p-4 border border-gray-200">
              <h3 class="text-sm font-medium text-blue-700 mb-1">Matched Triplets</h3>
              <p class="text-2xl font-bold text-blue-900">{{ matchingResults?.matchedTriplets.length || 0 }}</p>
              <p class="text-sm text-blue-600 mt-1">Total successful matches</p>
            </div>
            
            <div class="bg-green-50 rounded-lg p-4 border border-gray-200">
              <h3 class="text-sm font-medium text-green-700 mb-1">Unmatched Singles</h3>
              <p class="text-2xl font-bold text-green-900">{{ matchingResults?.unmatchedSingles.length || 0 }}</p>
              <p class="text-sm text-green-600 mt-1">Remaining singles</p>
            </div>
            
            <div class="bg-purple-50 rounded-lg p-4 border border-gray-200">
              <h3 class="text-sm font-medium text-purple-700 mb-1">Unmatched Pairs</h3>
              <p class="text-2xl font-bold text-purple-900">{{ matchingResults?.unmatchedPairs.length || 0 }}</p>
              <p class="text-sm text-purple-600 mt-1">Remaining pairs</p>
            </div>
          </div>

          <!-- Matched Triplets -->
          <div class="mb-8">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Matched Triplets</h3>
            <div class="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table class="min-w-full divide-y divide-gray-300">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200">Match #</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200">Original ID</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200">Single</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200">Pair</th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Pair Members</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="(match, index) in matchingResults?.matchedTriplets" :key="index" 
                      class="hover:bg-gray-50 transition-colors">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                      {{ index + 1 }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                      {{ match.originalTripletId }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                      <div class="text-sm text-gray-900">ID: {{ match.newSingle.id }}</div>
                      <div class="text-sm text-gray-500">
                        <span :class="{
                          'px-2 py-0.5 rounded-full text-xs font-medium': true,
                          'bg-blue-100 text-blue-800': match.newSingle.gender === 0,
                          'bg-pink-100 text-pink-800': match.newSingle.gender === 1
                        }">
                          {{ match.newSingle.gender === 0 ? 'Male' : 'Female' }}
                        </span>
                        | Score: {{ match.newSingle.score }}
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap border-r border-gray-200">
                      <div class="text-sm text-gray-900">ID: {{ match.newPair.id }}</div>
                      <div class="text-sm text-gray-500">Score: {{ match.newPair.pairScore }}</div>
                    </td>
                    <td class="px-6 py-4">
                      <div class="space-y-1">
                        <div v-for="member in match.newPair.members" :key="member.id" 
                             class="text-sm text-gray-600">
                          ID: {{ member.id }} | 
                          <span :class="{
                            'px-2 py-0.5 rounded-full text-xs font-medium': true,
                            'bg-blue-100 text-blue-800': member.gender === 0,
                            'bg-pink-100 text-pink-800': member.gender === 1
                          }">
                            {{ member.gender === 0 ? 'Male' : 'Female' }}
                          </span>
                          | Score: {{ member.score }}
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Unmatched Sections -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Unmatched Singles -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sample Unmatched Singles</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200">ID</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200">Gender</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Score</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="single in matchingResults?.unmatchedSingles.slice(0, 5)" :key="single.id"
                        class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                        {{ single.id }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        <span :class="{
                          'px-2 py-0.5 rounded-full text-xs font-medium': true,
                          'bg-blue-100 text-blue-800': single.gender === 0,
                          'bg-pink-100 text-pink-800': single.gender === 1
                        }">
                          {{ single.gender === 0 ? 'Male' : 'Female' }}
                        </span>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {{ single.score }}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Unmatched Pairs -->
            <div class="bg-gray-50 rounded-lg p-4 border border-gray-200 shadow-sm">
              <h3 class="text-lg font-semibold text-gray-900 mb-4">Sample Unmatched Pairs</h3>
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200">Pair ID</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200 border-r border-gray-200">Pair Score</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200">Members</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="pair in matchingResults?.unmatchedPairs.slice(0, 5)" :key="pair.id"
                        class="hover:bg-gray-50 transition-colors">
                      <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r border-gray-200">
                        {{ pair.id }}
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 border-r border-gray-200">
                        {{ pair.pairScore }}
                      </td>
                      <td class="px-6 py-4">
                        <div class="space-y-1">
                          <div v-for="member in pair.members" :key="member.id"
                               class="text-sm text-gray-600">
                            ID: {{ member.id }} | 
                            <span :class="{
                              'px-2 py-0.5 rounded-full text-xs font-medium': true,
                              'bg-blue-100 text-blue-800': member.gender === 0,
                              'bg-pink-100 text-pink-800': member.gender === 1
                            }">
                              {{ member.gender === 0 ? 'Male' : 'Female' }}
                            </span>
                            | Score: {{ member.score }}
                          </div>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.vue';
import RegionPieChart from '~/components/RegionPieChart.vue';
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
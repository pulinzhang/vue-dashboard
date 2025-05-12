<template>
  <div class="container">
    <h1>Welcome to Vue Dashboard</h1>
    <p>2024 Budget and Sales Analysis</p>
    <BudgetChart />
    <RegionPieChart />
  </div>
</template>

<script setup lang="ts">
import BudgetChart from '~/components/BudgetChart.vue';
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
<template>
  <div class="chart-container">
    <h2>2024 Budget vs Actual Sales</h2>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import { generateYearlyData, type MonthlyData } from '~/utils/mockData';

const chartRef = ref<HTMLElement | null>(null);
const data = generateYearlyData();

onMounted(() => {
  if (!chartRef.value) return;

  const margin = { top: 20, right: 30, bottom: 40, left: 60 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;

  // Create SVG
  const svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  // Create scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, width])
    .padding(0.1);

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => Math.max(d.budget, d.actual))! * 1.1])
    .range([height, 0]);

  // Add X axis
  svg.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x))
    .selectAll('text')
    .attr('transform', 'rotate(-45)')
    .style('text-anchor', 'end');

  // Add Y axis
  svg.append('g')
    .call(d3.axisLeft(y).ticks(5).tickFormat(d => `$${d.toLocaleString()}`));

  // Create line generators
  const line = d3.line<MonthlyData>()
    .x(d => x(d.month)! + x.bandwidth() / 2)
    .y(d => y(d.budget));

  const line2 = d3.line<MonthlyData>()
    .x(d => x(d.month)! + x.bandwidth() / 2)
    .y(d => y(d.actual));

  // Add budget line
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#4CAF50')
    .attr('stroke-width', 2)
    .attr('d', line);

  // Add actual sales line
  svg.append('path')
    .datum(data)
    .attr('fill', 'none')
    .attr('stroke', '#2196F3')
    .attr('stroke-width', 2)
    .attr('d', line2);

  // Add budget data points and labels
  svg.selectAll('.budget-dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'budget-dot')
    .attr('cx', d => x(d.month)! + x.bandwidth() / 2)
    .attr('cy', d => y(d.budget))
    .attr('r', 4)
    .attr('fill', '#4CAF50');

  svg.selectAll('.budget-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'budget-label')
    .attr('x', d => x(d.month)! + x.bandwidth() / 2)
    .attr('y', d => y(d.budget) - 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '10px')
    .text(d => `$${d.budget.toLocaleString()}`);

  // Add actual sales data points and labels
  svg.selectAll('.actual-dot')
    .data(data)
    .enter()
    .append('circle')
    .attr('class', 'actual-dot')
    .attr('cx', d => x(d.month)! + x.bandwidth() / 2)
    .attr('cy', d => y(d.actual))
    .attr('r', 4)
    .attr('fill', '#2196F3');

  svg.selectAll('.actual-label')
    .data(data)
    .enter()
    .append('text')
    .attr('class', 'actual-label')
    .attr('x', d => x(d.month)! + x.bandwidth() / 2)
    .attr('y', d => y(d.actual) - 10)
    .attr('text-anchor', 'middle')
    .style('font-size', '10px')
    .text(d => `$${d.actual.toLocaleString()}`);

  // Add legend
  const legend = svg.append('g')
    .attr('transform', `translate(${width - 150}, 0)`);

  legend.append('line')
    .attr('x1', 0)
    .attr('y1', 0)
    .attr('x2', 20)
    .attr('y2', 0)
    .attr('stroke', '#4CAF50')
    .attr('stroke-width', 2);

  legend.append('text')
    .attr('x', 30)
    .attr('y', 4)
    .text('Budget')
    .style('font-size', '12px');

  legend.append('line')
    .attr('x1', 0)
    .attr('y1', 20)
    .attr('x2', 20)
    .attr('y2', 20)
    .attr('stroke', '#2196F3')
    .attr('stroke-width', 2);

  legend.append('text')
    .attr('x', 30)
    .attr('y', 24)
    .text('Actual')
    .style('font-size', '12px');
});
</script>

<style scoped>
.chart-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.chart {
  width: 100%;
  height: 400px;
  margin-top: 20px;
}

h2 {
  color: #333;
  margin-bottom: 20px;
  text-align: center;
}
</style> 
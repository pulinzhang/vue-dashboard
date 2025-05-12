<template>
  <div class="chart-container">
    <h2>Sales by Region</h2>
    <div ref="chartRef" class="chart"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import * as d3 from 'd3';
import { generateRegionData, type RegionData } from '~/utils/mockData';

const chartRef = ref<HTMLElement | null>(null);
const data = generateRegionData();

onMounted(() => {
  if (!chartRef.value) return;

  const margin = { top: 20, right: 30, bottom: 40, left: 30 };
  const width = 800 - margin.left - margin.right;
  const height = 400 - margin.top - margin.bottom;
  const radius = Math.min(width, height) / 2;

  // Create SVG
  const svg = d3.select(chartRef.value)
    .append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', `translate(${width/2 + margin.left},${height/2 + margin.top})`);

  // Create color scale
  const color = d3.scaleOrdinal()
    .domain(data.map(d => d.region))
    .range(d3.schemeCategory10);

  // Create pie generator
  const pie = d3.pie<RegionData>()
    .value(d => d.sales)
    .sort(null);

  const arc = d3.arc<d3.PieArcDatum<RegionData>>()
    .innerRadius(0)
    .outerRadius(radius);

  const outerArc = d3.arc<d3.PieArcDatum<RegionData>>()
    .innerRadius(radius * 0.9)
    .outerRadius(radius * 0.9);

  // Draw pie chart
  const path = svg.selectAll('path')
    .data(pie(data))
    .enter()
    .append('path')
    .attr('d', arc)
    .attr('fill', d => color(d.data.region))
    .attr('stroke', 'white')
    .style('stroke-width', '2px')
    .style('opacity', 0.7);

  // Add hover effect
  path.on('mouseover', function() {
    d3.select(this)
      .style('opacity', 1)
      .style('cursor', 'pointer');
  })
  .on('mouseout', function() {
    d3.select(this)
      .style('opacity', 0.7);
  });

  // Add label lines
  const polyline = svg.selectAll('polyline')
    .data(pie(data))
    .enter()
    .append('polyline')
    .attr('points', d => {
      const pos = outerArc.centroid(d);
      pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
      return [arc.centroid(d), outerArc.centroid(d), pos];
    })
    .style('fill', 'none')
    .style('stroke', '#666')
    .style('stroke-width', '1px');

  // Add labels
  const text = svg.selectAll('text')
    .data(pie(data))
    .enter()
    .append('text')
    .attr('transform', d => {
      const pos = outerArc.centroid(d);
      pos[0] = radius * 1.05 * (midAngle(d) < Math.PI ? 1 : -1);
      return `translate(${pos})`;
    })
    .attr('dy', '.35em')
    .style('text-anchor', d => midAngle(d) < Math.PI ? 'start' : 'end')
    .text(d => `${d.data.region}: $${d.data.sales.toLocaleString()}`)
    .style('font-size', '12px');

  // Add center title
  svg.append('text')
    .attr('text-anchor', 'middle')
    .attr('dy', '0.35em')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Total Sales');

  // Helper function: calculate angle
  function midAngle(d: d3.PieArcDatum<RegionData>) {
    return d.startAngle + (d.endAngle - d.startAngle) / 2;
  }
});
</script>

<style scoped>
.chart-container {
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
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
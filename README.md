# Vue Dashboard

A data visualization dashboard project built with Nuxt 3 and D3.js, showcasing budget and sales data analysis.

## Features

- Built with Nuxt 3 framework
- Data visualization using D3.js
- Responsive design
- Interactive charts
- Mock data generation

## Charts

1. **Budget vs Actual Sales Comparison**
   - Displays monthly budget and actual sales data for 2024
   - Includes data point markers and specific values
   - Uses different colors to distinguish budget and actual sales

2. **Regional Sales Distribution Pie Chart**
   - Shows sales distribution across different regions
   - Includes hover effects
   - Displays specific sales amounts
   - Uses guide lines to connect labels

## Tech Stack

- Nuxt 3
- Vue 3
- TypeScript
- D3.js
- Faker.js (for mock data generation)

## Getting Started

### Install Dependencies

```bash
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

## Project Structure

```
├── components/          # Vue components
│   ├── BudgetChart.vue  # Budget comparison chart
│   └── RegionPieChart.vue # Regional distribution pie chart
├── utils/              # Utility functions
│   └── mockData.ts     # Mock data generation
├── pages/              # Page components
│   └── index.vue       # Main page
└── public/             # Static assets
```

## Data Description

The project uses mock data, including:

1. Monthly Data
   - Budget amounts
   - Actual sales amounts

2. Regional Data
   - North America
   - Europe
   - Asia Pacific
   - Latin America
   - Middle East & Africa

## Development Notes

- TypeScript for type safety
- Component-based design for maintainability and scalability
- Responsive layout for different screen sizes
- Professional data visualization using D3.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

MIT License

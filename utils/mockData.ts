import { faker } from '@faker-js/faker';

export interface MonthlyData {
  month: string;
  budget: number;
  actual: number;
}

export interface RegionData {
  region: string;
  sales: number;
}

export function generateYearlyData(): MonthlyData[] {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return months.map(month => {
    const budget = faker.number.int({ min: 80000, max: 120000 });
    // Actual sales fluctuate between 80% and 120% of budget
    const actual = Math.round(budget * faker.number.float({ min: 0.8, max: 1.2 }));
    
    return {
      month,
      budget,
      actual
    };
  });
}

export function generateRegionData(): RegionData[] {
  const regions = [
    'North America',
    'Europe',
    'Asia Pacific',
    'Latin America',
    'Middle East & Africa'
  ];

  return regions.map(region => ({
    region,
    sales: faker.number.int({ min: 200000, max: 500000 })
  }));
} 
# Vue Dashboard with Matching Algorithm

A Vue.js dashboard application featuring budget analysis charts and an advanced matching algorithm.

## Features

### 1. Budget Analysis
- Interactive budget comparison chart using D3.js
- Monthly budget vs. actual spending visualization
- Responsive design for all screen sizes

### 2. Sales Distribution
- Regional sales distribution pie chart
- Interactive data visualization
- Real-time data updates

### 3. Matching Algorithm (matchTriplets)
The application includes an advanced matching algorithm that matches triplets with new participants based on specific criteria:

#### Algorithm Features
- Matches individuals and pairs based on gender and score compatibility
- Handles 100 original triplets and 100 new participants
- Supports mixed-gender pair combinations
- Provides detailed matching statistics and results

#### Data Structure
```javascript
// Original Triplet Structure
{
    id: string,
    individual: {
        id: string,
        gender: number, // 0 for male, 1 for female
        score: number
    },
    pair: {
        score: number,
        genderCombination: string
    }
}

// New Participant Structure
{
    singles: Array<{
        id: string,
        gender: number,
        score: number
    }>,
    pairs: Array<{
        id: string,
        members: Array<{
            id: string,
            gender: number,
            score: number
        }>,
        pairScore: number
    }>
}
```

#### Usage
```javascript
import { matchTriplets, sampleData } from './utils/matchTripletsUtil';

// Run the matching algorithm
const result = matchTriplets(sampleData.originalTriplets, sampleData.newParticipants);

// Result structure
{
    matchedTriplets: Array<{
        originalTripletId: string,
        newSingle: Individual,
        newPair: Pair
    }>,
    unmatchedSingles: Array<Individual>,
    unmatchedPairs: Array<Pair>
}
```

## Project Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Deployment
The application is configured for deployment on Cloudflare Pages. The build process automatically generates the necessary configuration files.

### Build Output
- Production build: `.output/public`
- Cloudflare Pages configuration: `_routes.json`

## Technologies Used
- Vue 3
- Nuxt 3
- D3.js
- Tailwind CSS
- Cloudflare Pages

## License
MIT

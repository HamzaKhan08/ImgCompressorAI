import { CountryPreset } from './types';

export const COUNTRY_PRESETS: CountryPreset[] = [
  {
    id: 'us',
    name: 'United States',
    widthMm: 51,
    heightMm: 51, // 2x2 inches
    dpi: 300,
    faceSizePercentMin: 50,
    faceSizePercentMax: 69,
    bgColor: '#FFFFFF',
    description: '2x2 inches (51x51mm). White background. Neutral expression.'
  },
  {
    id: 'uk',
    name: 'United Kingdom',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    faceSizePercentMin: 60,
    faceSizePercentMax: 75,
    bgColor: '#E0E0E0', // Light Grey usually accepted/preferred over pure white sometimes, but standard is cream/light grey
    description: '35x45mm. Light grey or cream background.'
  },
  {
    id: 'in',
    name: 'India',
    widthMm: 35,
    heightMm: 45, // Sometimes 35x35 or 51x51 depending on visa type, but passport is 35x45 or 51x51. Sticking to standard passport.
    dpi: 300,
    faceSizePercentMin: 60,
    faceSizePercentMax: 70,
    bgColor: '#FFFFFF',
    description: '35x45mm or 51x51mm. White background.'
  },
  {
    id: 'schengen',
    name: 'Schengen (EU)',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    faceSizePercentMin: 70,
    faceSizePercentMax: 80,
    bgColor: '#FFFFFF',
    description: '35x45mm. Light background. Face covers 70-80%.'
  },
  {
    id: 'ca',
    name: 'Canada',
    widthMm: 50,
    heightMm: 70,
    dpi: 300,
    faceSizePercentMin: 50,
    faceSizePercentMax: 60,
    bgColor: '#FFFFFF',
    description: '50x70mm. White background. Neutral face.'
  },
  {
    id: 'jp',
    name: 'Japan',
    widthMm: 35,
    heightMm: 45,
    dpi: 300,
    faceSizePercentMin: 60,
    faceSizePercentMax: 70,
    bgColor: '#FFFFFF',
    description: '35x45mm. White background.'
  }
];

export const MM_TO_INCH = 0.0393701;

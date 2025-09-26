// data/defaultSettings.ts
import { Settings } from '@/types';

export const defaultSettings: Settings = {
  siteTitle: {
    id: '1',
    key: 'siteTitle',
    value: 'My Portfolio Website',
    type: 'string',
    category: 'general',
    label: 'Site Title',
    description: 'The title of your website',
    order: 1
  },
  siteDescription: {
    id: '2',
    key: 'siteDescription',
    value: 'A modern portfolio website built with Next.js and Tailwind CSS',
    type: 'text',
    category: 'general',
    label: 'Site Description',
    description: 'A brief description of your website',
    order: 2
  },
  siteUrl: {
    id: '3',
    key: 'siteUrl',
    value: 'https://yourportfolio.com',
    type: 'string',
    category: 'general',
    label: 'Site URL',
    description: 'The full URL of your website',
    order: 3
  },
  theme: {
    id: '4',
    key: 'theme',
    value: 'dark',
    type: 'select',
    category: 'appearance',
    label: 'Theme',
    description: 'Default theme for your website',
    options: ['light', 'dark', 'system'],
    order: 1
  },
  primaryColor: {
    id: '5',
    key: 'primaryColor',
    value: '#007AFF',
    type: 'string',
    category: 'appearance',
    label: 'Primary Color',
    description: 'Main brand color for your website',
    order: 2
  }
};
// data/seedSettings.ts
import { SettingCategory, SettingType } from '@/types';

export const defaultSettingsSeed = [
  // General Settings
  {
    key: 'siteTitle',
    value: 'My Portfolio Website',
    type: 'string' as SettingType,
    category: 'general' as SettingCategory,
    label: 'Site Title',
    description: 'The title of your website',
    order: 1,
  },
  {
    key: 'siteDescription', 
    value: 'A modern portfolio website built with Next.js and Tailwind CSS',
    type: 'text' as SettingType,
    category: 'general' as SettingCategory,
    label: 'Site Description',
    description: 'A brief description of your website',
    order: 2,
  },
  {
    key: 'siteUrl',
    value: 'https://yourportfolio.com',
    type: 'string' as SettingType,
    category: 'general' as SettingCategory,
    label: 'Site URL',
    description: 'The full URL of your website',
    order: 3,
  },

  // Appearance Settings
  {
    key: 'theme',
    value: 'dark',
    type: 'select' as SettingType,
    category: 'appearance' as SettingCategory,
    label: 'Theme',
    description: 'Default theme for your website',
    options: ['light', 'dark', 'system'],
    order: 1,
  },
  {
    key: 'primaryColor',
    value: '#007AFF',
    type: 'string' as SettingType,
    category: 'appearance' as SettingCategory,
    label: 'Primary Color',
    description: 'Main brand color for your website',
    order: 2,
  },

  // Contact Settings (for contact page)
  {
    key: 'contactEmail',
    value: 'hello@devfolio.com',
    type: 'string' as SettingType,
    category: 'contact' as SettingCategory,
    label: 'Contact Email',
    description: 'Your email address for contact',
    order: 1,
  },
  {
    key: 'contactPhone',
    value: '+1 (555) 123-4567', 
    type: 'string' as SettingType,
    category: 'contact' as SettingCategory,
    label: 'Contact Phone',
    description: 'Your phone number for contact',
    order: 2,
  },
  {
    key: 'contactLocation',
    value: 'Jakarta, Indonesia',
    type: 'string' as SettingType,
    category: 'contact' as SettingCategory,
    label: 'Contact Location',
    description: 'Your location',
    order: 3,
  },

  // SEO Settings
  {
    key: 'metaDescription',
    value: 'A modern portfolio website for developers',
    type: 'text' as SettingType,
    category: 'seo' as SettingCategory,
    label: 'Meta Description',
    description: 'Default meta description for SEO',
    order: 1,
  },
  {
    key: 'metaKeywords',
    value: 'portfolio, developer, nextjs, tailwind',
    type: 'string' as SettingType,
    category: 'seo' as SettingCategory,
    label: 'Meta Keywords',
    description: 'Default meta keywords for SEO',
    order: 2,
  },

  // Social Settings
  {
    key: 'githubUrl',
    value: 'https://github.com/yourusername',
    type: 'string' as SettingType,
    category: 'social' as SettingCategory,
    label: 'GitHub URL',
    description: 'Your GitHub profile URL',
    order: 1,
  },
  {
    key: 'twitterUrl',
    value: 'https://twitter.com/yourusername',
    type: 'string' as SettingType,
    category: 'social' as SettingCategory,
    label: 'Twitter URL',
    description: 'Your Twitter profile URL', 
    order: 2,
  },
  {
    key: 'linkedinUrl',
    value: 'https://linkedin.com/in/yourusername',
    type: 'string' as SettingType,
    category: 'social' as SettingCategory,
    label: 'LinkedIn URL',
    description: 'Your LinkedIn profile URL',
    order: 3,
  },

  // Email Settings
  {
    key: 'smtpServer',
    value: 'smtp.example.com',
    type: 'string' as SettingType,
    category: 'email' as SettingCategory,
    label: 'SMTP Server',
    description: 'SMTP server for sending emails',
    order: 1,
  },
  {
    key: 'smtpPort',
    value: '587',
    type: 'number' as SettingType,
    category: 'email' as SettingCategory,
    label: 'SMTP Port',
    description: 'SMTP port for sending emails',
    order: 2,
  },
];
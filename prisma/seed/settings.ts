import { PrismaClient } from '@prisma/client'

const defaultSettings = [
  // General Settings
  {
    key: 'siteTitle',
    value: 'My Portfolio',
    type: 'string',
    category: 'general',
    label: 'Site Title',
    description: 'The title of your website',
    order: 1
  },
  {
    key: 'siteDescription',
    value: 'A modern portfolio website',
    type: 'text',
    category: 'general',
    label: 'Site Description',
    description: 'A brief description of your website',
    order: 2
  },
  {
    key: 'siteUrl',
    value: 'http://localhost:3000',
    type: 'string',
    category: 'general',
    label: 'Site URL',
    description: 'The base URL of your website',
    order: 3
  },
  {
    key: 'adminEmail',
    value: 'admin@example.com',
    type: 'string',
    category: 'general',
    label: 'Admin Email',
    description: 'Email address for admin notifications',
    order: 4
  },
  {
    key: 'timezone',
    value: 'UTC',
    type: 'string',
    category: 'general',
    label: 'Timezone',
    description: 'Default timezone for the website',
    options: JSON.stringify(['UTC', 'America/New_York', 'Europe/London', 'Asia/Tokyo']),
    order: 5
  },

  // Appearance Settings
  {
    key: 'theme',
    value: 'light',
    type: 'string',
    category: 'appearance',
    label: 'Theme',
    description: 'Default theme for the website',
    options: JSON.stringify(['light', 'dark', 'system']),
    order: 1
  },
  {
    key: 'primaryColor',
    value: '#3b82f6',
    type: 'string',
    category: 'appearance',
    label: 'Primary Color',
    description: 'Primary brand color',
    order: 2
  },
  {
    key: 'secondaryColor',
    value: '#6366f1',
    type: 'string',
    category: 'appearance',
    label: 'Secondary Color',
    description: 'Secondary brand color',
    order: 3
  },
  {
    key: 'fontFamily',
    value: 'Inter',
    type: 'string',
    category: 'appearance',
    label: 'Font Family',
    description: 'Default font family',
    options: JSON.stringify(['Inter', 'Roboto', 'Open Sans', 'Poppins', 'Montserrat']),
    order: 4
  },
  {
    key: 'enableAnimations',
    value: 'true',
    type: 'boolean',
    category: 'appearance',
    label: 'Enable Animations',
    description: 'Enable CSS animations and transitions',
    order: 5
  },

  // SEO Settings
  {
    key: 'metaTitle',
    value: 'My Portfolio - Web Developer',
    type: 'string',
    category: 'seo',
    label: 'Meta Title',
    description: 'Default meta title for SEO',
    order: 1
  },
  {
    key: 'metaDescription',
    value: 'Professional portfolio showcasing my projects and skills',
    type: 'text',
    category: 'seo',
    label: 'Meta Description',
    description: 'Default meta description for SEO',
    order: 2
  },
  {
    key: 'metaKeywords',
    value: 'portfolio, web developer, projects',
    type: 'string',
    category: 'seo',
    label: 'Meta Keywords',
    description: 'Comma-separated keywords for SEO',
    order: 3
  },
  {
    key: 'googleAnalytics',
    value: '',
    type: 'string',
    category: 'seo',
    label: 'Google Analytics ID',
    description: 'Google Analytics tracking ID',
    order: 4
  },
  {
    key: 'googleSiteVerification',
    value: '',
    type: 'string',
    category: 'seo',
    label: 'Google Site Verification',
    description: 'Google Search Console verification code',
    order: 5
  },

  // Social Media
  {
    key: 'socialFacebook',
    value: '',
    type: 'string',
    category: 'social',
    label: 'Facebook URL',
    description: 'Your Facebook profile URL',
    order: 1
  },
  {
    key: 'socialTwitter',
    value: '',
    type: 'string',
    category: 'social',
    label: 'Twitter URL',
    description: 'Your Twitter profile URL',
    order: 2
  },
  {
    key: 'socialInstagram',
    value: '',
    type: 'string',
    category: 'social',
    label: 'Instagram URL',
    description: 'Your Instagram profile URL',
    order: 3
  },
  {
    key: 'socialLinkedIn',
    value: '',
    type: 'string',
    category: 'social',
    label: 'LinkedIn URL',
    description: 'Your LinkedIn profile URL',
    order: 4
  },
  {
    key: 'socialGithub',
    value: '',
    type: 'string',
    category: 'social',
    label: 'GitHub URL',
    description: 'Your GitHub profile URL',
    order: 5
  },
  {
    key: 'socialYoutube',
    value: '',
    type: 'string',
    category: 'social',
    label: 'YouTube URL',
    description: 'Your YouTube channel URL',
    order: 6
  },

  // Contact Information
  {
    key: 'contactEmail',
    value: 'hello@example.com',
    type: 'string',
    category: 'contact',
    label: 'Contact Email',
    description: 'Email address for contact form',
    order: 1
  },
  {
    key: 'contactPhone',
    value: '',
    type: 'string',
    category: 'contact',
    label: 'Contact Phone',
    description: 'Phone number for contact',
    order: 2
  },
  {
    key: 'contactAddress',
    value: '',
    type: 'text',
    category: 'contact',
    label: 'Contact Address',
    description: 'Physical address for contact',
    order: 3
  },
  {
    key: 'contactFormEnabled',
    value: 'true',
    type: 'boolean',
    category: 'contact',
    label: 'Contact Form Enabled',
    description: 'Enable or disable the contact form',
    order: 4
  },

  // Email Settings
  {
    key: 'smtpHost',
    value: '',
    type: 'string',
    category: 'email',
    label: 'SMTP Host',
    description: 'SMTP server host',
    order: 1
  },
  {
    key: 'smtpPort',
    value: '587',
    type: 'number',
    category: 'email',
    label: 'SMTP Port',
    description: 'SMTP server port',
    order: 2
  },
  {
    key: 'smtpUser',
    value: '',
    type: 'string',
    category: 'email',
    label: 'SMTP Username',
    description: 'SMTP authentication username',
    order: 3
  },
  {
    key: 'smtpPassword',
    value: '',
    type: 'string',
    category: 'email',
    label: 'SMTP Password',
    description: 'SMTP authentication password',
    order: 4
  },
  {
    key: 'smtpFrom',
    value: 'noreply@example.com',
    type: 'string',
    category: 'email',
    label: 'From Email',
    description: 'Email address shown as sender',
    order: 5
  },
  {
    key: 'emailNotifications',
    value: 'true',
    type: 'boolean',
    category: 'email',
    label: 'Email Notifications',
    description: 'Enable email notifications for new contacts',
    order: 6
  }
]

export async function seedSettings(prisma: PrismaClient) {
  console.log('🌱 Seeding settings...')

  // Delete existing settings
  await prisma.siteSettings.deleteMany()

  // Create default settings
  for (const setting of defaultSettings) {
    await prisma.siteSettings.create({
      data: setting
    })
  }

  console.log('✅ Settings seeded.')
}
// data/footerData.ts
import { FooterData } from '@/types';

export const footerData: FooterData = {
  brand: "Devfolio™",
  copyright: `© ${new Date().getFullYear()} Devfolio. All rights reserved.`,
  socialLinks: [
    { name: 'GitHub', url: 'https://github.com/akhyarazamta', icon: 'FaGithub' },
    { name: 'Twitter', url: 'https://twitter.com/akhyarazamta', icon: 'FaTwitter' },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/akhyarazamta', icon: 'FaLinkedin' }
  ]
};
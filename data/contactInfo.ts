// data/contactInfo.ts
import { ContactInfo } from '@/types';

export const contactInfoData: ContactInfo[] = [
  { id: 1, type: 'email', value: 'hello@devfolio.com', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 2, type: 'phone', value: '+1 (555) 123-4567', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 3, type: 'location', value: 'Jakarta, Indonesia', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }
];
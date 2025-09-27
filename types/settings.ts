// types/index.ts
export interface Setting {
  id: string;
  key: string;
  value: string | number | boolean;
  type: SettingType;
  category: SettingCategory;
  label: string;
  description?: string;
  options?: string[];
  order: number;
  createdAt?: string;
  updatedAt?: string;
}

export type SettingType = 'string' | 'text' | 'number' | 'boolean' | 'select';
export type SettingCategory = 'general' | 'appearance' | 'seo' | 'social' | 'contact' | 'email';

export interface Settings {
  [key: string]: Setting;
}

export interface NewSettingForm {
  key: string;
  value: string | number | boolean;
  type: SettingType;
  category: SettingCategory;
  label: string;
  description: string;
  options: string[];
  order: number;
}

export interface ContactInfo {
  id: number;
  type: 'email' | 'phone' | 'location';
  value: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface FooterData {
  brand: string;
  copyright: string;
  socialLinks: SocialLink[];
}

export interface AppearanceSettings {
  primaryColor?: { value: string };
  secondaryColor?: { value: string };
  accentColor?: { value: string };
  backgroundColor?: { value: string };
  textColor?: { value: string };
  borderColor?: { value: string };
  primaryColorDark?: { value: string };
  secondaryColorDark?: { value: string };
  accentColorDark?: { value: string };
  backgroundColorDark?: { value: string };
  textColorDark?: { value: string };
  borderColorDark?: { value: string };
  theme?: { value: string };
}
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

async function fetchSettings() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/settings`, { 
      // Tambahkan timeout untuk prevent hanging
      next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    if (!res.ok) {
      console.warn('Failed to fetch settings, using defaults');
      return {};
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

export async function generateMetadata() {
  const settings = await fetchSettings();

  return {
    title: settings.siteTitle?.value || "Devfolio | Portfolio Website",
    description: settings.siteDescription?.value || "A modern portfolio website for developers",
    keywords: settings.metaKeywords?.value || "portfolio, developer, nextjs, tailwind",
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSettings();

  // PERBAIKAN: Extract values dengan safe access
  const getSettingValue = (key: string, defaultValue: string = '') => {
    return settings[key]?.value || defaultValue;
  };

  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <style>{`
          :root {
            --color-primary: ${getSettingValue('primaryColor', '#007AFF')};
            --color-secondary: ${getSettingValue('secondaryColor', '#F1F1F1')};
            --color-accent: ${getSettingValue('accentColor', '#FF6B35')};
            --color-background: ${getSettingValue('backgroundColor', '#E7F2EF')};
            --color-text: ${getSettingValue('textColor', '#000000')};
            --color-border: ${getSettingValue('borderColor', '#e5e7eb')};
          }

          .dark {
            --color-primary: ${getSettingValue('primaryColorDark', '#60a5fa')};
            --color-secondary: ${getSettingValue('secondaryColorDark', '#374151')};
            --color-accent: ${getSettingValue('accentColorDark', '#fdba74')};
            --color-background: ${getSettingValue('backgroundColorDark', '#131F3F')};
            --color-text: ${getSettingValue('textColorDark', '#ffffff')};
            --color-border: ${getSettingValue('borderColorDark', '#374151')};
          }
        `}</style>
      </head>
      <body>
        {/* PERBAIKAN: Kirim hanya settings yang diperlukan */}
        <ThemeProvider initialAppearance={settings}>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen pt-16 bg-background">{children}</main>
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
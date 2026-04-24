import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Malhar Pawar | Data Engineer & Analytics Architect',
  description: 'Portfolio of Malhar Pawar — Data Engineer, Analytics Architect, and AI innovator building intelligent data systems and BI platforms.',
  keywords: ['Data Engineer', 'Analytics Engineer', 'Power BI', 'Azure', 'Microsoft Fabric', 'AI', 'LLM', 'Portfolio'],
  authors: [{ name: 'Malhar Pawar' }],
  openGraph: {
    title: 'Malhar Pawar | Data Engineer & Analytics Architect',
    description: 'Building intelligent data systems that drive decisions.',
    type: 'website',
    locale: 'en_US',
    siteName: 'Malhar Pawar Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malhar Pawar | Data Engineer & Analytics Architect',
    description: 'Building intelligent data systems that drive decisions.',
    creator: '@malharpawar505',
  },
  robots: { index: true, follow: true },
};

import MouseTrailer from '@/components/MouseTrailer';

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <MouseTrailer />
        <div className="mesh-bg" />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

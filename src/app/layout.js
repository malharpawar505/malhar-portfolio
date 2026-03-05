import './globals.css';

export const metadata = {
  title: 'Malhar Pawar — Data Engineer & Analytics Architect',
  description: 'Portfolio of Malhar Pawar — Data Engineer, BI Architect, and AI Explorer building intelligent data systems with Power BI, Azure, Fabric, and LLMs.',
  keywords: ['Data Engineer', 'Power BI', 'Analytics', 'Azure', 'Microsoft Fabric', 'AI', 'Malhar Pawar'],
  openGraph: {
    title: 'Malhar Pawar — Data Engineer & Analytics Architect',
    description: 'Building intelligent data systems that drive decisions.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Malhar Pawar — Data Engineer',
    description: 'Building intelligent data systems that drive decisions.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}

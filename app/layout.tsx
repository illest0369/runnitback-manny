import './globals.css';
import type { ReactNode } from 'react';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'RunnitBack Mobile',
  description: 'RunnitBack TV mobile control surface',
  applicationName: 'RunnitBack TV Mobile',
  icons: { icon: '/icon.svg', apple: '/icon.svg' },
  openGraph: {
    title: 'RunnitBack TV Mobile',
    description: 'Mobile command center for queue, clips, and captions',
    images: ['/og.svg']
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RunnitBack TV Mobile',
    description: 'Mobile command center for queue, clips, and captions',
    images: ['/og.svg']
  }
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

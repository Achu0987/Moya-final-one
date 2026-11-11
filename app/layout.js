import { League_Spartan, Outfit } from 'next/font/google';
import './globals.css';
import './site.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';

// The brand book's two families (p.14): League Spartan for headings (the font of the logo), Outfit for body text.
// next/font downloads both at build time and serves them from this site (self-hosted).
const display = League_Spartan({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const text = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-text',
  display: 'swap',
});

export const metadata = {
  title: 'MoyaOne: drinking water on tap in every flat',
  description:
    'MoyaOne brings drinking water on tap to every flat in your tower. No jugs, no filters. Recharge litres from your phone.',
};

export const viewport = {
  themeColor: '#FFFFFF',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${text.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}

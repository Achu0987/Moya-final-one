import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import './site.css';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/common/WhatsAppButton';
import Intro from '@/components/common/Intro';

// next/font downloads both families at build time and serves them from this site (self-hosted).
const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const text = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-text',
  display: 'swap',
});

export const metadata = {
  title: 'Moya One: drinking water on tap in every flat',
  description:
    'Moya One brings drinking water on tap to every flat in your tower. No jugs, no filters. Recharge litres from your phone.',
};

export const viewport = {
  themeColor: '#FAFAF7',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-IN" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <head>
        {/* the opening moment plays once per visit; this runs before paint so a repeat view never flashes it */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{if(sessionStorage.getItem('moya-intro'))document.documentElement.dataset.intro='seen'}catch(e){}",
          }}
        />
      </head>
      <body>
        <Intro />
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

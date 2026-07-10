import './globals.css';
import { StateProvider } from '@/components/StateContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import SearchOverlay from '@/components/SearchOverlay';
import AIFashionAssistant from '@/components/AIFashionAssistant';
import MobileBottomNav from '@/components/MobileBottomNav';

export const metadata = {
  title: 'LOUIS PASTEUR | Haute Couture & AI Sizing Atelier',
  description: 'Experience luxury D2C fashion with bespoke styling, 360° virtual fitting, and real-time AI measurements.',
  metadataBase: new URL('http://localhost:3000'),
  // PWA / App meta
  themeColor: '#000000',
  viewport: 'width=device-width, initial-scale=1, viewport-fit=cover',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Louis Pasteur',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* PWA / App-like manifest */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-[#F4F4F2] text-luxury-black font-sans antialiased overscroll-none">
        <StateProvider>
          {/* Main Layout Container */}
          <div className="relative min-h-screen flex flex-col">
            {/* Desktop Navbar — hidden on mobile app */}
            <Navbar />
            <CartDrawer />
            <SearchOverlay />
            
            {/* Page Content — extra bottom padding on mobile for bottom nav */}
            <main className="flex-grow pt-[72px] md:pt-[80px] pb-[70px] md:pb-0">
              {children}
            </main>
            
            {/* Desktop Footer — hidden on mobile */}
            <div className="hidden md:block">
              <Footer />
            </div>
            
            {/* Mobile Bottom Navigation Bar */}
            <MobileBottomNav />
            
            {/* Persistent Floating AI Chatbot Assistant */}
            <AIFashionAssistant />
          </div>
        </StateProvider>
      </body>
    </html>
  );
}

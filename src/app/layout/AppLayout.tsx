import React, { useEffect } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';
import { Header } from '@/widgets/Header';
import { SubNav } from '@/widgets/SubNav';
import { Footer } from '@/widgets/Footer';
import { BookingModal } from '@/widgets/BookingModal';

export const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const isHome = useMatch('/');
  const isAuth = useMatch('/auth');
  // The messenger fills the viewport like an app screen: no section bar, no footer.
  const isMessenger = useMatch('/messages/*');

  // New page → start at the top.
  useEffect(() => window.scrollTo(0, 0), [pathname]);

  return (
    <div className="app-layout">
      {/* Home and auth lay the header over the hero photo; home places the section bar itself. */}
      <Header transparent={Boolean(isHome || isAuth)} />
      {!isHome && !isAuth && !isMessenger && <SubNav />}
      <main className="main-content">
        <Outlet />
      </main>
      {!isMessenger && <Footer />}
      <BookingModal />
    </div>
  );
};

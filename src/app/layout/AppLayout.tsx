import React, { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useMatch } from 'react-router-dom';
import { Header } from '@/widgets/Header';
import { SubNav } from '@/widgets/SubNav';
import { Footer } from '@/widgets/Footer';
import { BookingModal } from '@/widgets/BookingModal';
import { useT } from '@/shared/i18n';

/** Routes that share a key keep their state (and skip the enter animation) while params change. */
const transitionKey = (pathname: string) => {
  if (pathname.startsWith('/messages')) return '/messages';
  if (pathname.startsWith('/cabinet')) return '/cabinet';
  return pathname;
};

export const AppLayout: React.FC = () => {
  const { pathname } = useLocation();
  const { t } = useT();
  const isHome = useMatch('/');
  const isAuth = useMatch('/auth');
  // The messenger fills the viewport like an app screen: no section bar, no footer.
  const isMessenger = useMatch('/messages/*');

  // New page → start at the top.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    document.title = t('meta.title');
  }, [t]);

  return (
    <div className="app-layout">
      {/* Home and auth lay the header over the hero photo; home places the section bar itself. */}
      <Header transparent={Boolean(isHome || isAuth)} />
      {!isHome && !isAuth && !isMessenger && <SubNav />}
      <main className="main-content" id="main" tabIndex={-1}>
        <Suspense fallback={<div className="route-loading" aria-hidden="true" />}>
          <div key={transitionKey(pathname)} className="page-transition">
            <Outlet />
          </div>
        </Suspense>
      </main>
      {!isMessenger && <Footer />}
      <BookingModal />
    </div>
  );
};

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Header } from '@/widgets/Header';
import { Footer } from '@/widgets/Footer';
import { BookingModal } from '@/widgets/BookingModal';
import { ScrollToTop } from '@/app/providers/ScrollToTop';

// Pages
import { HomePage } from '@/pages/HomePage';
import { CatalogGuidesPage } from '@/pages/CatalogGuidesPage';
import { CatalogPlacesPage } from '@/pages/CatalogPlacesPage';
import { CatalogCarsPage } from '@/pages/CatalogCarsPage';
import { DetailGuidePage } from '@/pages/DetailGuidePage';
import { DetailPlacePage } from '@/pages/DetailPlacePage';
import { DetailCarPage } from '@/pages/DetailCarPage';
import { AuthPage } from '@/pages/AuthPage';
import { CabinetPage } from '@/pages/CabinetPage';

export const App: React.FC = () => {
  return (
    <div className="app-layout">
      <ScrollToTop />
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalog/guides" element={<CatalogGuidesPage />} />
          <Route path="/catalog/places" element={<CatalogPlacesPage />} />
          <Route path="/catalog/cars" element={<CatalogCarsPage />} />
          <Route path="/guides/:id" element={<DetailGuidePage />} />
          <Route path="/places/:id" element={<DetailPlacePage />} />
          <Route path="/cars/:id" element={<DetailCarPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/cabinet" element={<CabinetPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <BookingModal />
    </div>
  );
};

export default App;

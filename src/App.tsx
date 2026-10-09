import { lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';

// Secondary routes load on demand; the home page ships in the main bundle.
const CatalogPage = lazy(() => import('@/pages/CatalogPage').then((m) => ({ default: m.CatalogPage })));
const GuidePage = lazy(() => import('@/pages/GuidePage').then((m) => ({ default: m.GuidePage })));
const CarPage = lazy(() => import('@/pages/CarPage').then((m) => ({ default: m.CarPage })));
const PlacePage = lazy(() => import('@/pages/PlacePage').then((m) => ({ default: m.PlacePage })));
const AuthPage = lazy(() => import('@/pages/AuthPage').then((m) => ({ default: m.AuthPage })));
const CabinetPage = lazy(() => import('@/pages/CabinetPage').then((m) => ({ default: m.CabinetPage })));
const MessagesPage = lazy(() => import('@/pages/MessagesPage').then((m) => ({ default: m.MessagesPage })));

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path="catalog/:kind" element={<CatalogPage />} />
          <Route path="guides/:id" element={<GuidePage />} />
          <Route path="cars/:id" element={<CarPage />} />
          <Route path="places/:id" element={<PlacePage />} />
          <Route path="auth" element={<AuthPage />} />
          <Route path="cabinet" element={<CabinetPage />} />
          <Route path="messages" element={<MessagesPage />} />
          <Route path="messages/:conversationId" element={<MessagesPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

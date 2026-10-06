import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/app/layout/AppLayout';
import { HomePage } from '@/pages/HomePage';
import { CatalogPage } from '@/pages/CatalogPage';
import { GuidePage } from '@/pages/GuidePage';
import { CarPage } from '@/pages/CarPage';
import { PlacePage } from '@/pages/PlacePage';
import { AuthPage } from '@/pages/AuthPage';
import { CabinetPage } from '@/pages/CabinetPage';
import { MessagesPage } from '@/pages/MessagesPage';

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

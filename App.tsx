
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import InterventionListPage from './pages/InterventionListPage';
import NewInterventionPage from './pages/NewInterventionPage';
import InterventionDetailPage from './pages/InterventionDetailPage';
import EditInterventionPage from './pages/EditInterventionPage';
import BottomNav from './components/BottomNav';

const App: React.FC = () => {
  return (
    <HashRouter>
      <div className="flex flex-col min-h-screen bg-slate-100">
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<InterventionListPage />} />
            <Route path="/new" element={<NewInterventionPage />} />
            <Route path="/intervention/:id" element={<InterventionDetailPage />} />
            <Route path="/intervention/:id/edit" element={<EditInterventionPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;

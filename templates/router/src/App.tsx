import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ApiDemo from './pages/ApiDemo';
import Docs from './pages/Docs';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout currentPath={window.location.pathname}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/api-demo" element={<ApiDemo />} />
          <Route path="/docs" element={<Docs />} />
          <Route path="/settings" element={<Settings />} />
          {/* Wildcard redirect back to root */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

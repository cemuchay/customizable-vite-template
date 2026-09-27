import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ApiDemo from './pages/ApiDemo';
import Docs from './pages/Docs';
import Settings from './pages/Settings';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';
import useAuthStore from './store/useAuthStore';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');
  const { isAuthenticated } = useAuthStore();

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard />;
      case '/api-demo':
        return <ApiDemo />;
      case '/docs':
        return <Docs />;
      case '/login':
        return <Login onSuccess={() => setCurrentPath('/')} />;
      case '/settings':
        return isAuthenticated ? (
          <Settings />
        ) : (
          <Login onSuccess={() => setCurrentPath('/settings')} />
        );
      default:
        return <NotFound onNavigate={setCurrentPath} />;
    }
  };

  return (
    <ErrorBoundary onReset={() => setCurrentPath('/')}>
      <Layout currentPath={currentPath} onNavigate={setCurrentPath}>
        {renderContent()}
      </Layout>
    </ErrorBoundary>
  );
}

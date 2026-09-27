import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ApiDemo from './pages/ApiDemo';
import Docs from './pages/Docs';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
  const [currentPath, setCurrentPath] = useState('/');

  const renderContent = () => {
    switch (currentPath) {
      case '/':
        return <Dashboard />;
      case '/api-demo':
        return <ApiDemo />;
      case '/docs':
        return <Docs />;
      case '/settings':
        return <Settings />;
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

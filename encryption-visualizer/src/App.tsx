import { Outlet } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { InstallPrompt } from './components/ui/InstallPrompt';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { VisualizationSession } from './components/learning/VisualizationSession';

function App() {
  return (
    <>
      <OfflineIndicator />
      <Layout>
        <VisualizationSession><Outlet /></VisualizationSession>
      </Layout>
      <InstallPrompt />
    </>
  );
}

export default App;

import React, { useEffect } from 'react';
import './App.scss';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import toast, { Toaster, useToasterStore } from 'react-hot-toast';
import { GameManagerPage } from './components/game-manager-component/game-manager.component';
import { ErrorPage } from './components/error-pages/error-page';
import { ConfigProvider } from 'antd';
import { ComponentThemeConfig } from './configs/component.config';
import { PlayerPage } from './components/player-component/player.component';

function App() {

  const { toasts } = useToasterStore()

  useEffect(() => {
    toasts
      .filter(t => t.visible) // Only consider visible toasts
      .filter((item, i) => i >= 3) // Is toast index over limit
      .forEach(t => toast.dismiss(t.id)) // Dismiss – Use toast.remove(t.id) removal without animation
  }, [toasts])

  const rootRouter = createBrowserRouter([
    {
      path: '/game-manager',
      element: <ConfigProvider theme={ComponentThemeConfig}>
        <GameManagerPage />
      </ConfigProvider>,
    },
    {
      path: '/gaming',
      element: <ConfigProvider theme={ComponentThemeConfig}>
        <PlayerPage />
      </ConfigProvider>,
    },
    {
      path: '/',
      element: <Navigate to="/gaming" />
    },
    {
      path: "*",
      element: <ErrorPage />
    },
  ]);

  return (
    <React.StrictMode>
      <RouterProvider router={rootRouter} />
      <Toaster
        position="bottom-right"
        reverseOrder={true}
        toastOptions={{
          duration: 3000
        }}
      />
    </React.StrictMode>
  );
}

export default App;

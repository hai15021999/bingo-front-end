import React from 'react';
import './App.scss';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { GameManagerPage } from './components/game-manager-component/game-manager.component';
import { ErrorPage } from './components/error-pages/error-page';
import { ConfigProvider } from 'antd';
import { ComponentThemeConfig } from './configs/component.config';
import { PlayerPage } from './components/player-component/player.component';

function App() {

  const rootRouter = createBrowserRouter([
    {
      errorElement: <ErrorPage />,
      children: [
        {
          path: '/game-manager',
          element: <ConfigProvider theme={ComponentThemeConfig}>
            <GameManagerPage />
          </ConfigProvider>,
          children: []
        },
        {
          path: '/gaming',
          element: <ConfigProvider theme={ComponentThemeConfig}>
            <PlayerPage />
          </ConfigProvider>,
          children: []
        },
      ]
    }
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

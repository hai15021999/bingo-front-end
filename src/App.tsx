import React, { createContext } from 'react';
import './App.scss';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { GameManagerPage } from './components/game-manager-component/game-manager.component';
import { ErrorPage } from './components/error-pages/error-page';
import { ConfigProvider } from 'antd';
import { ComponentThemeConfig } from './configs/component.config';
import { PlayerPage } from './components/player-component/player.component';
import { SocketService } from './common/services/socket-io.service';
import { Toaster } from 'react-hot-toast';
import { PlayerServices } from './components/player-component/player.service';
import { GameManagerServices } from './components/game-manager-component/game-manager.service';

const socketService = new SocketService();
const playerService = new PlayerServices(socketService);
const managerService = new GameManagerServices(socketService);
const AppContext = createContext({
  playerService,
  managerService
});
const AppProviderPlayer = ({ children }: any) => {
  return <AppContext.Provider value={{
    playerService,
    managerService
  }}>{children}</AppContext.Provider>;
};

function App() {

  const rootRouter = createBrowserRouter([
    {
      path: '/game-manager',
      element: <ConfigProvider theme={ComponentThemeConfig}>
        <GameManagerPage socketService={socketService} />
      </ConfigProvider>,
    },
    {
      path: '/gaming',
      element: <ConfigProvider theme={ComponentThemeConfig}>
        <AppProviderPlayer>
          {/* <PlayerPage socketService={socketService} /> */}
          <PlayerPage />
        </AppProviderPlayer>
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
export { AppProviderPlayer, AppContext }

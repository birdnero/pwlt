import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store/store';
import Diary from './components/diary';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Auth from './components/components/auth';

const router = createBrowserRouter([
  {
    path: "/auth",
    element: <Auth />
  },
  {
    path: "/*",
    element: <Diary />,
  },

]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <RouterProvider router={router} />
    </ReduxProvider>
  </React.StrictMode >,
)
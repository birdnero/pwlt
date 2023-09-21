import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from './store/store';
import Diary from './components/diary';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
      <ReduxProvider store={store}>
        <Diary/>
      </ReduxProvider>
  </React.StrictMode>,
)
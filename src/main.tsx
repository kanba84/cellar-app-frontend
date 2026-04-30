import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { initAxiosClient } from './api/axiosClient';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme';

async function bootstrap() {
  await initAxiosClient();

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  );
}

bootstrap();
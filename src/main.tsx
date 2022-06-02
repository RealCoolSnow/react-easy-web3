import React from 'react'
import ReactDOM from 'react-dom/client'
import '@/styles/main.css'
import App from './App'
import { store } from './store'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <App />
      </Provider>
    </ThemeProvider>
  </React.StrictMode>,
)

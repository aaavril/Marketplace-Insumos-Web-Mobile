import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { GlobalStateProvider } from './context/GlobalStateContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GlobalStateProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GlobalStateProvider>
  </React.StrictMode>,
)


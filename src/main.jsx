import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const logsEnabled = import.meta.env.VITE_LOGS_ENABLED === 'true'

if (!logsEnabled) {
  console.log = () => {}
  console.info = () => {}
  console.debug = () => {}
  console.warn = () => {}
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

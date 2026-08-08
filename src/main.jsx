import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './css/global.css'
import App from './App.jsx'
import { dbService } from './services/dbService.js'

// Initialize the mock database (LocalStorage sync)
dbService.init();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

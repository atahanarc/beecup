import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // <-- YENİ EKLENTİ
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* Uygulamayı sarmaladık */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
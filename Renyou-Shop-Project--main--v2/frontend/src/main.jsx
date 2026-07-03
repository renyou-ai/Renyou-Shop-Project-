import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from "axios";
import './index.css'
import './i18n';
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

const token = localStorage.getItem("token");

if (token) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
}

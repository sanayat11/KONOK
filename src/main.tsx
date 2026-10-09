import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@/app/styles/global.scss'
import '@/shared/i18n'
import App from './App'

// Scroll reveals hide content only when the browser can reveal it again.
if ('IntersectionObserver' in window) document.documentElement.classList.add('js-reveal')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

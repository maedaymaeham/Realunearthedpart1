import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Unearthed from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Unearthed />
  </StrictMode>,
)

import './logStore.js' // first, so it captures logs and errors from page load
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createTEConnect } from '@magensa/te-connect'
import { TEConnect } from '@magensa/te-connect-react'
import './index.css'
import App from './App.jsx'

// Frame host override (e.g. the Magensa dev host). Omitted = production.
const frameBaseUrl = import.meta.env.VITE_TEC_BASE_URL || undefined

const teConnectInstance = createTEConnect('SFAxNDg5NjY0Ni9NQUc5NDY3OTgzNDU6UTRrT1ZTSio=', {
  hideZip: true,
  tecPaymentRequest: {
    appleMerchantId: 'AP29473615',
    googleMerchantId: 'BCR2DN4T4CU2XKIQ',
  },
  ...(frameBaseUrl && { frameBaseUrl }),
})

const Root = () => (
  <TEConnect teConnect={teConnectInstance}>
    <App />
  </TEConnect>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)

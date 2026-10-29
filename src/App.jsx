import { useEffect, useRef, useState } from 'react'
import {
  CardEntry,
  TecPaymentRequestButtons,
  useTeConnect,
  useTecPaymentsRequest,
} from '@magensa/te-connect-react'
import { cardEntryStyles, paymentRequestOptions } from './config.js'
import useVirtualLog from './useVirtualLog.js'
import './App.css'

const asText = (value) => (typeof value === 'string' ? value : JSON.stringify(value))

const formatResult = (result) => {
  const { token, error } = result
  if (error) return asText(error)
  if (token) return asText(token)
  return asText(result)
}

function LogArg({ arg }) {
  if (arg.kind === 'error') {
    return (
      <div className="log-error">
        <div className="log-error-summary">
          <span className="log-error-type">{arg.type}</span>
          <span className="log-error-name">{arg.name}</span>
          {arg.message && <span className="log-error-message">{arg.message}</span>}
        </div>
        {arg.stack && <pre className="log-error-stack">{arg.stack}</pre>}
      </div>
    )
  }
  if (arg.kind === 'object') {
    return (
      <div className="log-object">
        <div className="log-object-heading">{arg.heading}</div>
        {arg.entries.length === 0 ? (
          <div className="log-object-empty">(no properties)</div>
        ) : (
          <ul className="log-object-entries">
            {arg.entries.map(([key, value]) => (
              <li key={key}>
                <span className="log-key">{key}:</span>
                <span className="log-value">{value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }
  return <span className="log-value-inline">{arg.value}</span>
}

function App() {
  const { createPayment, getCurrentElements } = useTeConnect()
  const createPaymentRequest = useTecPaymentsRequest()

  const [paymentRequest, setPaymentRequest] = useState(null)
  const [walletAvailability, setWalletAvailability] = useState(null)
  const [result, setResult] = useState(null)
  const [source, setSource] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [logEntries, clearLog] = useVirtualLog()
  const logRef = useRef(null)

  // Keep the log scrolled to the newest entry.
  useEffect(() => {
    const el = logRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [logEntries])

  // Check which wallets (Apple Pay / Google Pay) this device supports.
  useEffect(() => {
    if (typeof createPaymentRequest !== 'function') return
    const prInterface = createPaymentRequest(paymentRequestOptions)
    prInterface.canMakePayments().then((availability) => {
      console.log('[POC]:', availability)
      if (availability) {
        setPaymentRequest(prInterface)
        setWalletAvailability(availability)
      }
    })
  }, [createPaymentRequest])

  // Receive wallet tokens and errors.
  useEffect(() => {
    if (!paymentRequest) return
    paymentRequest.listenFor('confirm-token', (response) => {
      console.log('confirm-token response', response)
      const { tokenDetails, completePayment, error } = response
      // Errors carry no tokenDetails, so the wallet type is unknown for them.
      const wallet = { applePay: 'Apple Pay', googlePay: 'Google Pay' }[tokenDetails?.type] ?? 'Wallet'
      setSource(wallet)
      setCopied(false)
      if (error) {
        console.error(`[${wallet}] confirm-token error:`, error)
        setResult({ error })
        completePayment?.('failure')
      } else {
        setResult(tokenDetails)
        completePayment?.('success')
      }
    })

    // Apple Pay session ended without a token (dismissed, unsupported device, etc).
    paymentRequest.listenFor('cancel-transaction', ({ sessionError }) => {
      console.warn('[Apple Pay] cancel-transaction:', sessionError)
      setSource('Apple Pay (cancelled)')
      setCopied(false)
      setResult({ cancelled: true, sessionError })
    })
  }, [paymentRequest])

  const handleCreateToken = async () => {
    setIsCreating(true)
    setCopied(false)
    try {
      const response = await createPayment(getCurrentElements())
      setSource('Manual Entry')
      setResult(response)
    } catch (err) {
      console.error('[Manual Entry] createPayment failed:', err)
      setSource('Manual Entry')
      setResult({ error: err?.message ?? String(err) })
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopy = async () => {
    if (!result) return
    try {
      await navigator.clipboard.writeText(formatResult(result))
      setCopied(true)
    } catch {
      setCopied(false)
    }
  }

  const hasWallets = !!(
    paymentRequest &&
    walletAvailability &&
    (walletAvailability.applePay || walletAvailability.googlePay)
  )

  return (
    <div className="demo">
      <header className="demo-header">
        <h1>TEConnect DEV Demo</h1>
        <p className="demo-subtitle">
          Tokenize a card via manual entry, Apple Pay, or Google Pay using TEConnect.
        </p>
      </header>

      <section className="demo-section" aria-label="Manual card entry">
        <h2>Manual Entry</h2>
        <div className="card-entry-wrapper">
          <CardEntry stylesConfig={cardEntryStyles} />
        </div>
        <button
          type="button"
          className="primary-button"
          onClick={handleCreateToken}
          disabled={isCreating}
        >
          {isCreating ? 'Creating Token...' : 'Create Token'}
        </button>
      </section>

      <section className="demo-section" aria-label="Wallet buttons">
        <h2>Wallet Buttons</h2>
        {hasWallets ? (
          <TecPaymentRequestButtons paymentRequestInterface={paymentRequest} />
        ) : (
          <p className="demo-empty">No wallet methods available on this device/browser.</p>
        )}
      </section>

      <section className="demo-section token-section" aria-label="Token output">
        <div className="token-header">
          <h2>Token Output</h2>
          {source && <span className="token-source">Source: {source}</span>}
        </div>
        {result ? (
          <>
            <pre className="token-output">{formatResult(result)}</pre>
            <button type="button" className="secondary-button" onClick={handleCopy}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </>
        ) : (
          <p className="demo-empty">Submit one of the flows above to view the token result.</p>
        )}
      </section>

      <section className="demo-section log-section" aria-label="Virtual log">
        <div className="token-header">
          <h2>Virtual Log</h2>
          <button type="button" className="secondary-button log-clear" onClick={clearLog}>
            Clear Log
          </button>
        </div>
        <div ref={logRef} className="log-output">
          {logEntries.length === 0 ? (
            <p className="demo-empty">No console output yet.</p>
          ) : (
            logEntries.map((entry) => (
              <div key={entry.id} className={`log-entry log-level-${entry.level}`}>
                <div className="log-meta">
                  <span className="log-timestamp">{entry.timestamp}</span>
                  <span className="log-level">{entry.level.toUpperCase()}</span>
                </div>
                <div className="log-body">
                  {entry.args.map((arg, i) => (
                    <LogArg key={i} arg={arg} />
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default App

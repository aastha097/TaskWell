import { useState } from 'react'
import { api } from '../api.js'
import Logo from './Logo.jsx'

export default function AuthScreen({ onSignedIn }) {
  const [mode, setMode] = useState('signin')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError('')
    setInfo('')
    setBusy(true)
    try {
      if (mode === 'signin') {
        const data = await api.signin(username, password)
        onSignedIn(data.token, username)
      } else {
        await api.signup(username, password)
        setInfo('Registered. Log in to continue.')
        setMode('signin')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <Logo size={32} />
        <h1>{mode === 'signin' ? 'Log in to continue' : 'Sign up for your account'}</h1>

        <form onSubmit={submit}>
          <input
            placeholder="Enter your username"
            aria-label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            type="password"
            placeholder="Enter password"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn primary full" disabled={busy}>
            {busy ? 'Working…' : mode === 'signin' ? 'Log in' : 'Sign up'}
          </button>
        </form>

        {error && <div className="msg err">{error}</div>}
        {info && <div className="msg ok">{info}</div>}

        <div className="auth-switch">
          {mode === 'signin' ? (
            <button type="button" className="text-link" onClick={() => setMode('signup')}>
              Create an account
            </button>
          ) : (
            <button type="button" className="text-link" onClick={() => setMode('signin')}>
              Already have an account? Log in
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

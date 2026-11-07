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
        setInfo('Account created. Log in to continue.')
        setMode('signin')
        setPassword('')
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
        <Logo size={36} />
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
        {error && <div className="msg err" role="alert">{error}</div>}
        {info && <div className="msg ok">{info}</div>}
        <button type="button" className="text-link" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); setInfo('') }}>
          {mode === 'signin' ? 'Create an account' : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  )
}

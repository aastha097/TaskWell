import { useState, useEffect, useRef } from 'react'
import Logo from './Logo.jsx'
import { initials } from '../boardColors.js'

export default function Topbar({ username, onSignOut, onCreate }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function close(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <header className="topbar">
      <Logo />
      <button className="topbar-create" onClick={onCreate}>
        Create
      </button>
      <div className="topbar-spacer" />
      <div className="account" ref={ref}>
        <button className="avatar lg" onClick={() => setOpen((o) => !o)} aria-label="Account">
          {initials(username)}
        </button>
        {open && (
          <div className="menu">
            <div className="menu-title">ACCOUNT</div>
            <div className="menu-user">
              <span className="avatar">{initials(username)}</span>
              <span>{username}</span>
            </div>
            <button className="menu-item" onClick={onSignOut}>
              Log out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
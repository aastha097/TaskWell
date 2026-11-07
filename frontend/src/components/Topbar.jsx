import { useState, useRef, useEffect } from 'react'
import Logo from './Logo.jsx'
import { Chevron, Check, Plus } from './Icons.jsx'

export default function Topbar({ orgs, currentOrgId, hasOrg, onSelectOrg, onNewOrg, onJoinOrg, onMembers, onNewBoard, onSignOut, onHome }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const close = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', esc)
    }
  }, [])

  const current = orgs.find((o) => o.id === currentOrgId)
  const pick = (fn) => () => { setOpen(false); fn() }

  return (
    <header className="topbar">
      <button className="logo-btn" onClick={onHome} aria-label="Trello home"><Logo /></button>
      <div className="topbar-spacer" />

      <div className="switcher" ref={ref}>
        <button className="select-btn" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          <span className="select-label">{current ? current.title : 'Workspaces'}</span>
          <Chevron />
        </button>
        {open && (
          <div className="menu" role="menu">
            <div className="menu-heading">Your workspaces</div>
            {orgs.length === 0 && <div className="menu-empty">No workspaces yet</div>}
            {orgs.map((o) => (
              <button key={o.id} role="menuitemradio" aria-checked={o.id === currentOrgId} className="menu-item" onClick={pick(() => onSelectOrg(o.id))}>
                <span className="ws-tile">{(o.title || '?')[0].toUpperCase()}</span>
                <span className="menu-item-label">{o.title}</span>
                {o.id === currentOrgId && <Check />}
              </button>
            ))}
            <div className="menu-sep" />
            <button className="menu-item" role="menuitem" onClick={pick(onNewOrg)}><Plus /> Create workspace</button>
            <button className="menu-item" role="menuitem" onClick={pick(onJoinOrg)}>Join with workspace ID</button>
          </div>
        )}
      </div>

      <button className="btn subtle-blue" onClick={onMembers} disabled={!hasOrg}>Members</button>
      <button className="btn primary" onClick={onNewBoard} disabled={!hasOrg}>+ Create board</button>
      <button className="btn ghost" onClick={onSignOut}>Log out</button>
    </header>
  )
}

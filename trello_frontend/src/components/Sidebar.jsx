import { useState } from 'react'
import { boardGradient } from '../boardColors.js'

export default function Sidebar({
  orgs,
  currentOrgId,
  boards,
  currentBoardId,
  onOpenOrg,
  onCreateOrg,
  onTrackOrg,
  onOpenBoard,
  onCreateBoard,
  showNewOrg,
  setShowNewOrg,
}) {
  const [newOrgTitle, setNewOrgTitle] = useState('')
  const [newOrgDesc, setNewOrgDesc] = useState('')
  const [showTrack, setShowTrack] = useState(false)
  const [trackId, setTrackId] = useState('')
  const [showNewBoard, setShowNewBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  function submitNewOrg(e) {
    e.preventDefault()
    if (!newOrgTitle.trim()) return
    onCreateOrg(newOrgTitle.trim(), newOrgDesc.trim())
    setNewOrgTitle('')
    setNewOrgDesc('')
    setShowNewOrg(false)
  }

  function submitTrack(e) {
    e.preventDefault()
    if (!trackId.trim()) return
    onTrackOrg(trackId.trim())
    setTrackId('')
    setShowTrack(false)
  }

  function submitNewBoard(e) {
    e.preventDefault()
    if (!newBoardTitle.trim()) return
    onCreateBoard(newBoardTitle.trim())
    setNewBoardTitle('')
    setShowNewBoard(false)
  }

  return (
    <aside className="sidebar">
      <div className="rail-head">
        <span>Workspaces</span>
        <button className="icon-btn" onClick={() => setShowNewOrg((s) => !s)} aria-label="New workspace">
          +
        </button>
      </div>

      {showNewOrg && (
        <form className="inline-create" onSubmit={submitNewOrg}>
          <input placeholder="Workspace name" value={newOrgTitle} onChange={(e) => setNewOrgTitle(e.target.value)} autoFocus />
          <input placeholder="Description (optional)" value={newOrgDesc} onChange={(e) => setNewOrgDesc(e.target.value)} />
          <div className="row">
            <button className="btn small primary" type="submit">Create</button>
            <button className="btn small subtle" type="button" onClick={() => setShowNewOrg(false)}>Cancel</button>
          </div>
        </form>
      )}

      <ul className="rail-list">
        {orgs.length === 0 && <li className="rail-empty">No workspaces yet</li>}
        {orgs.map((o) => (
          <li key={o.id} className={o.id === currentOrgId ? 'active' : ''} onClick={() => onOpenOrg(o.id)}>
            <span className="ws-tile">{(o.title || '?')[0].toUpperCase()}</span>
            <span className="rail-label">{o.title}</span>
          </li>
        ))}
      </ul>

      {!showTrack ? (
        <button className="text-link pad" onClick={() => setShowTrack(true)}>
          Join workspace by ID
        </button>
      ) : (
        <form className="inline-create" onSubmit={submitTrack}>
          <input placeholder="Workspace ID" value={trackId} onChange={(e) => setTrackId(e.target.value)} autoFocus />
          <div className="row">
            <button className="btn small primary" type="submit">Add</button>
            <button className="btn small subtle" type="button" onClick={() => setShowTrack(false)}>Cancel</button>
          </div>
        </form>
      )}

      {currentOrgId && (
        <>
          <div className="rail-head spaced">
            <span>Your boards</span>
            <button className="icon-btn" onClick={() => setShowNewBoard((s) => !s)} aria-label="New board">
              +
            </button>
          </div>

          {showNewBoard && (
            <form className="inline-create" onSubmit={submitNewBoard}>
              <input placeholder="Board title" value={newBoardTitle} onChange={(e) => setNewBoardTitle(e.target.value)} autoFocus />
              <div className="row">
                <button className="btn small primary" type="submit">Create</button>
                <button className="btn small subtle" type="button" onClick={() => setShowNewBoard(false)}>Cancel</button>
              </div>
            </form>
          )}

          <ul className="rail-list">
            {boards.length === 0 && <li className="rail-empty">No boards yet</li>}
            {boards.map((b) => (
              <li key={b._id} className={b._id === currentBoardId ? 'active' : ''} onClick={() => onOpenBoard(b)}>
                <span className="board-swatch" style={{ background: boardGradient(b._id) }} />
                <span className="rail-label">{b.title}</span>
              </li>
            ))}
          </ul>
        </>
      )}
    </aside>
  )
}

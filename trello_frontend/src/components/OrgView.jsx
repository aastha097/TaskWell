import { useState } from 'react'
import { boardGradient, initials } from '../boardColors.js'

export default function OrgView({ org, boards, onOpenBoard, onCreateBoard, onAddMember, onRemoveMember }) {
  const [addName, setAddName] = useState('')
  const [removeName, setRemoveName] = useState('')
  const [newBoard, setNewBoard] = useState('')
  const [creating, setCreating] = useState(false)

  return (
    <div className="org-view">
      <header className="ws-header">
        <span className="ws-tile xl">{(org.title || '?')[0].toUpperCase()}</span>
        <div>
          <h2>{org.title}</h2>
          <p className="ws-desc">{org.description || 'No description yet.'}</p>
          <p className="ws-id">ID: {org.id}</p>
        </div>
      </header>

      <section className="section">
        <h3 className="section-title">Boards</h3>
        <div className="board-grid">
          {boards.map((b) => (
            <button className="board-tile" key={b._id} onClick={() => onOpenBoard(b)} style={{ background: boardGradient(b._id) }}>
              <span className="board-tile-title">{b.title}</span>
            </button>
          ))}

          {creating ? (
            <form
              className="board-tile new-open"
              onSubmit={(e) => {
                e.preventDefault()
                if (newBoard.trim()) {
                  onCreateBoard(newBoard.trim())
                  setNewBoard('')
                  setCreating(false)
                }
              }}
            >
              <input placeholder="Board title" value={newBoard} onChange={(e) => setNewBoard(e.target.value)} autoFocus />
              <div className="row">
                <button className="btn small primary" type="submit">Create</button>
                <button className="btn small subtle" type="button" onClick={() => setCreating(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <button className="board-tile new" onClick={() => setCreating(true)}>
              Create new board
            </button>
          )}
        </div>
      </section>

      <section className="section">
        <h3 className="section-title">
          Members <span className="count">{org.members.length}</span>
        </h3>
        <div className="member-list">
          {org.members.length === 0 && <div className="rail-empty">No members yet</div>}
          {org.members.map((m) => (
            <div className="member-row" key={m.id}>
              <span className="avatar">{initials(m.username)}</span>
              <span>{m.username}</span>
            </div>
          ))}
        </div>

        <div className="panel-forms">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (addName.trim()) {
                onAddMember(addName.trim())
                setAddName('')
              }
            }}
          >
            <input placeholder="Username to invite" value={addName} onChange={(e) => setAddName(e.target.value)} />
            <button className="btn primary" type="submit">Add</button>
          </form>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (removeName.trim()) {
                onRemoveMember(removeName.trim())
                setRemoveName('')
              }
            }}
          >
            <input placeholder="Username to remove" value={removeName} onChange={(e) => setRemoveName(e.target.value)} />
            <button className="btn danger" type="submit">Remove</button>
          </form>
        </div>
        <p className="panel-note">Only the workspace admin can add or remove members.</p>
      </section>
    </div>
  )
}

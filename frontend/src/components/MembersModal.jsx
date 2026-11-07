import { useState } from 'react'
import Modal from './Modal.jsx'
import Avatar from './Avatar.jsx'

export default function MembersModal({ org, people, isAdmin, onAdd, onRemove, onClose }) {
  const [name, setName] = useState('')
  const [copied, setCopied] = useState(false)

  function copy() {
    navigator.clipboard?.writeText(org.id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    }).catch(() => {})
  }

  function add(e) {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(name.trim())
    setName('')
  }

  return (
    <Modal title="Workspace members" onClose={onClose} width={520}>
      <div className="form">
        <div className="ws-id">
          <div>
            <div className="muted">Workspace ID</div>
            <code>{org.id}</code>
          </div>
          <button className="btn subtle small" onClick={copy}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
        <p className="muted">People you add can open this workspace by entering its ID.</p>

        {isAdmin && (
          <form className="inline-form" onSubmit={add}>
            <input placeholder="Username to add" aria-label="Username to add" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn primary">Add member</button>
          </form>
        )}

        <ul className="people">
          {people.map((p) => (
            <li key={p.id}>
              <Avatar name={p.username} size={32} />
              <span className="grow">{p.username}</span>
              {p.admin ? (
                <span className="lozenge">Admin</span>
              ) : (
                isAdmin && (
                  <button
                    className="btn ghost danger small"
                    onClick={() => window.confirm(`Remove ${p.username} from this workspace?`) && onRemove(p.username)}
                  >
                    Remove
                  </button>
                )
              )}
            </li>
          ))}
        </ul>
        {!isAdmin && <p className="muted">Only the workspace admin can add or remove members.</p>}
      </div>
    </Modal>
  )
}

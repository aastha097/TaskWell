import { useState } from 'react'
import Modal from './Modal.jsx'
import { Close, Lines } from './Icons.jsx'
import { STATUSES, LABEL } from '../statuses.js'

export default function CardModal({ issue, people, onPatch, onClose }) {
  const [title, setTitle] = useState(issue.title || '')
  const [desc, setDesc] = useState(issue.description || '')
  const [editing, setEditing] = useState(false)
  const status = issue.status || 'TODO'

  function saveTitle() {
    const t = title.trim()
    if (t && t !== issue.title) onPatch(issue._id, { title: t })
    else setTitle(issue.title || '')
  }

  function saveDesc() {
    const d = desc.trim()
    if (d !== (issue.description || '')) onPatch(issue._id, { description: d })
    setEditing(false)
  }

  return (
    <Modal onClose={onClose} width={768} autoFocus={false}>
      <div className="cardback">
        <header className="cardback-head">
          <div className="grow">
            <textarea
              className="cardback-title"
              rows={2}
              aria-label="Card title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={saveTitle}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), e.currentTarget.blur())}
            />
            <p className="cardback-in">in list <strong>{LABEL[status]}</strong></p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close"><Close /></button>
        </header>

        <div className="cardback-body">
          <div className="cardback-main">
            <h3><Lines /> Description</h3>
            {editing ? (
              <>
                <textarea
                  className="desc-edit"
                  autoFocus
                  rows={6}
                  value={desc}
                  placeholder="Add a more detailed description…"
                  onChange={(e) => setDesc(e.target.value)}
                />
                <div className="row">
                  <button className="btn primary small" onClick={saveDesc}>Save</button>
                  <button className="btn ghost small" onClick={() => { setDesc(issue.description || ''); setEditing(false) }}>Cancel</button>
                </div>
              </>
            ) : (
              <button className={`desc-view${issue.description ? '' : ' empty'}`} onClick={() => setEditing(true)}>
                {issue.description || 'Add a more detailed description…'}
              </button>
            )}
          </div>

          <aside className="cardback-side">
            <label className="field">
              <span>Status</span>
              <select value={status} onChange={(e) => onPatch(issue._id, { status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{LABEL[s]}</option>)}
              </select>
            </label>
            <label className="field">
              <span>Assignee</span>
              <select value={issue.assignedTo || ''} onChange={(e) => onPatch(issue._id, { assignedTo: e.target.value || null })}>
                <option value="">Unassigned</option>
                {people.map((p) => <option key={p.id} value={p.id}>{p.username}</option>)}
              </select>
            </label>
          </aside>
        </div>
      </div>
    </Modal>
  )
}

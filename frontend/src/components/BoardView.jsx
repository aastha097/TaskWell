import { useState } from 'react'
import Avatar from './Avatar.jsx'
import { Back, Close, Lines, Plus } from './Icons.jsx'
import { STATUSES, LABEL } from '../statuses.js'

export default function BoardView({ board, org, issues, people, onBack, onMembers, onCreateIssue, onPatch, onOpenCard }) {
  const [composer, setComposer] = useState(null)
  const [over, setOver] = useState(null)

  function drop(e, status) {
    e.preventDefault()
    setOver(null)
    const issue = issues.find((i) => i._id === e.dataTransfer.getData('text/plain'))
    if (issue && (issue.status || 'TODO') !== status) onPatch(issue._id, { status })
  }

  return (
    <div className="board">
      <header className="board-bar">
        <button className="btn glass small" onClick={onBack}><Back /> Boards</button>
        <h1 className="board-title">{board.title}</h1>
        <span className="board-org">{org.title}</span>
        <div className="grow" />
        <button className="avatar-stack" onClick={onMembers} aria-label="Workspace members">
          {people.slice(0, 5).map((p) => <Avatar key={p.id} name={p.username} size={28} />)}
        </button>
      </header>

      <div className="lists">
        {STATUSES.map((status) => {
          const items = issues.filter((i) => (i.status || 'TODO') === status)
          return (
            <section
              key={status}
              className={`list${over === status ? ' over' : ''}`}
              aria-label={LABEL[status]}
              onDragOver={(e) => { e.preventDefault(); setOver(status) }}
              onDragLeave={(e) => !e.currentTarget.contains(e.relatedTarget) && setOver(null)}
              onDrop={(e) => drop(e, status)}
            >
              <div className="list-head">
                <h2>{LABEL[status]}</h2>
                <span className="list-count">{items.length}</span>
              </div>
              <ul className="cards">
                {items.map((issue) => (
                  <li key={issue._id}><Card issue={issue} people={people} onOpen={onOpenCard} /></li>
                ))}
              </ul>
              {composer === status ? (
                <Composer
                  onCancel={() => setComposer(null)}
                  onAdd={(title) => { onCreateIssue({ title, status }); setComposer(null) }}
                />
              ) : (
                <button className="list-add" onClick={() => setComposer(status)}><Plus /> Add a card</button>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}

function Card({ issue, people, onOpen }) {
  const assignee = people.find((p) => p.id === String(issue.assignedTo))
  return (
    <div
      className="card"
      role="button"
      tabIndex={0}
      draggable
      onClick={() => onOpen(issue._id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpen(issue._id) }
      }}
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', issue._id)
        e.dataTransfer.effectAllowed = 'move'
        e.currentTarget.classList.add('dragging')
      }}
      onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
    >
      <span className="card-title">{issue.title}</span>
      {(issue.description || assignee) && (
        <span className="card-meta">
          {issue.description && <span className="card-badge" title="Has a description"><Lines /></span>}
          {assignee && <Avatar name={assignee.username} size={24} />}
        </span>
      )}
    </div>
  )
}

function Composer({ onAdd, onCancel }) {
  const [title, setTitle] = useState('')

  function submit(e) {
    e?.preventDefault()
    if (title.trim()) onAdd(title.trim())
  }

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        autoFocus
        placeholder="Enter a title for this card…"
        aria-label="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) submit(e)
          if (e.key === 'Escape') onCancel()
        }}
      />
      <div className="row">
        <button className="btn primary small" type="submit">Add card</button>
        <button className="icon-btn" type="button" onClick={onCancel} aria-label="Cancel"><Close /></button>
      </div>
    </form>
  )
}

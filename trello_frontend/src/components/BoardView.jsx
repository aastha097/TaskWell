import { useState } from 'react'
import WorkOrderCard from './WorkOrderCard.jsx'

const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE']
const LABEL = { TODO: 'To Do', IN_PROGRESS: 'In Progress', DONE: 'Done' }

export default function BoardView({ board, org, issues, onCreateIssue, onAdvance, onReassign }) {
  const [openForm, setOpenForm] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  function handleDrop(e, status) {
    e.preventDefault()
    setDragOver(null)
    const id = e.dataTransfer.getData('text/plain')
    const issue = issues.find((i) => i._id === id)
    if (issue && (issue.status || 'TODO') !== status) onAdvance(issue, status)
  }

  return (
    <div className="board-view">
      <header className="board-bar">
        <h2>{board.title}</h2>
        <span className="board-bar-org">{org.title}</span>
      </header>

      <div className="lists">
        {STATUSES.map((status) => {
          const items = issues.filter((i) => (i.status || 'TODO') === status)
          return (
            <section
              className={`list ${dragOver === status ? 'over' : ''}`}
              key={status}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOver(status)
              }}
              onDragLeave={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) setDragOver(null)
              }}
              onDrop={(e) => handleDrop(e, status)}
            >
              <div className="list-head">
                <h3>{LABEL[status]}</h3>
                <span className="list-count">{items.length}</span>
              </div>

              <div className="list-cards">
                {items.map((issue) => (
                  <WorkOrderCard
                    key={issue._id}
                    issue={issue}
                    members={org.members}
                    statuses={STATUSES}
                    onAdvance={onAdvance}
                    onReassign={onReassign}
                  />
                ))}
              </div>

              {openForm === status ? (
                <NewIssueForm
                  members={org.members}
                  onCancel={() => setOpenForm(null)}
                  onCreate={(payload) => {
                    onCreateIssue({ ...payload, status })
                    setOpenForm(null)
                  }}
                />
              ) : (
                <button className="list-add" onClick={() => setOpenForm(status)}>
                  <span>+</span> Add a card
                </button>
              )}
            </section>
          )
        })}
      </div>
    </div>
  )
}

function NewIssueForm({ members, onCancel, onCreate }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!title.trim()) return
    onCreate({ title: title.trim(), description: description.trim(), assignedTo: assignedTo || undefined })
  }

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        className="composer-title"
        placeholder="Enter a title for this card…"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) submit(e)
        }}
        autoFocus
      />
      <textarea
        className="composer-desc"
        placeholder="Add a description…"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} aria-label="Assign member">
        <option value="">Unassigned</option>
        {members.map((m) => (
          <option key={m.id} value={m.id}>
            {m.username}
          </option>
        ))}
      </select>
      <div className="row">
        <button className="btn primary" type="submit">Add card</button>
        <button className="icon-btn big" type="button" onClick={onCancel} aria-label="Cancel">✕</button>
      </div>
    </form>
  )
}

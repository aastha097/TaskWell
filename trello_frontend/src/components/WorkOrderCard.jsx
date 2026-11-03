import { initials } from '../boardColors.js'

export default function WorkOrderCard({ issue, members, statuses, onAdvance, onReassign }) {
  const status = issue.status || 'TODO'
  const idx = statuses.indexOf(status)
  const next = statuses[idx + 1]
  const assignee = members.find((m) => m.id === issue.assignedTo)

  return (
    <div
      className="card"
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', issue._id)
        e.dataTransfer.effectAllowed = 'move'
        e.currentTarget.classList.add('dragging')
      }}
      onDragEnd={(e) => e.currentTarget.classList.remove('dragging')}
    >
      <div className="card-title">{issue.title}</div>
      {issue.description && <div className="card-desc">{issue.description}</div>}

      <div className="card-foot">
        {next ? (
          <button className="card-move" onClick={() => onAdvance(issue, next)}>
            Move to {next.replace('_', ' ').toLowerCase()}
          </button>
        ) : (
          <span className="card-complete">✓ Complete</span>
        )}

        <label className={`assignee ${assignee ? 'set' : ''}`} title={assignee ? assignee.username : 'Assign member'}>
          <span className="avatar">{assignee ? initials(assignee.username) : '+'}</span>
          <select
            aria-label="Assign member"
            value={issue.assignedTo || ''}
            onChange={(e) => onReassign(issue, e.target.value)}
          >
            <option value="">Unassigned</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.username}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  )
}

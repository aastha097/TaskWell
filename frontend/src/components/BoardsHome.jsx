import { boardGradient } from '../boardColors.js'

export default function BoardsHome({ org, boards, onOpenBoard, onNewBoard }) {
  return (
    <div className="page">
      <h1>{org.title}</h1>
      <p className="page-sub">Choose a board to view its issues.</p>
      <section className="panel">
        {boards.length === 0 ? (
          <div className="empty">
            <strong>No boards yet.</strong>
            <span>Create your first board to start organising work.</span>
          </div>
        ) : (
          <div className="board-grid">
            {boards.map((b) => (
              <button className="board-tile" key={b._id} style={{ background: boardGradient(b._id) }} onClick={() => onOpenBoard(b)}>
                <span>{b.title}</span>
              </button>
            ))}
            <button className="board-tile new" onClick={onNewBoard}>Create new board</button>
          </div>
        )}
      </section>
    </div>
  )
}

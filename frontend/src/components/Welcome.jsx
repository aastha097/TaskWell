export default function Welcome({ orgs, onOpenOrg, onNewOrg, onJoinOrg }) {
  const has = orgs.length > 0
  return (
    <div className="page">
      <h1>{has ? 'Choose a workspace' : 'Welcome to Trello'}</h1>
      <p className="page-sub">
        {has ? 'Open a workspace to see its boards.' : 'Workspaces hold your boards and the people you work with.'}
      </p>
      <section className="panel">
        {has && (
          <ul className="ws-list">
            {orgs.map((o) => (
              <li key={o.id}>
                <button className="menu-item" onClick={() => onOpenOrg(o.id)}>
                  <span className="ws-tile">{(o.title || '?')[0].toUpperCase()}</span>
                  <span className="menu-item-label">{o.title}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
        <div className="empty">
          {!has && (
            <>
              <strong>No workspaces yet.</strong>
              <span>Create your first workspace to start organising work.</span>
            </>
          )}
          <div className="empty-actions">
            <button className="btn primary" onClick={onNewOrg}>Create workspace</button>
            <button className="btn subtle" onClick={onJoinOrg}>Join with workspace ID</button>
          </div>
        </div>
      </section>
    </div>
  )
}

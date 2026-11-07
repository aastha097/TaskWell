import { useState, useEffect, useMemo, useCallback } from 'react'
import { api, getToken } from './api.js'
import { boardGradient } from './boardColors.js'
import AuthScreen from './components/AuthScreen.jsx'
import Topbar from './components/Topbar.jsx'
import Welcome from './components/Welcome.jsx'
import BoardsHome from './components/BoardsHome.jsx'
import BoardView from './components/BoardView.jsx'
import CardModal from './components/CardModal.jsx'
import MembersModal from './components/MembersModal.jsx'
import FormModal from './components/FormModal.jsx'
import Toast from './components/Toast.jsx'

// The API has no "list my workspaces" route, so workspace IDs are remembered per user in localStorage.
const orgKey = (u) => `dispatch_orgs:${u}`
function loadOrgs(username) {
  try {
    return JSON.parse(localStorage.getItem(orgKey(username)) ?? localStorage.getItem('dispatch_orgs') ?? '[]')
  } catch {
    return []
  }
}

function userIdFromToken(token) {
  try {
    return JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/'))).userId
  } catch {
    return null
  }
}

export default function App() {
  const [token, setToken] = useState(getToken())
  const [username, setUsername] = useState(localStorage.getItem('dispatch_username') || '')
  const [orgs, setOrgs] = useState(() => loadOrgs(localStorage.getItem('dispatch_username') || ''))
  const [currentOrg, setCurrentOrg] = useState(null)
  const [boards, setBoards] = useState([])
  const [currentBoard, setCurrentBoard] = useState(null)
  const [issues, setIssues] = useState([])
  const [activeIssueId, setActiveIssueId] = useState(null)
  const [modal, setModal] = useState(null) // 'board' | 'org' | 'join' | 'members'
  const [toast, setToast] = useState(null)

  const userId = useMemo(() => (token ? userIdFromToken(token) : null), [token])
  const notify = useCallback((message, isError = false) => setToast({ message, isError, key: Date.now() }), [])

  useEffect(() => {
    if (username) localStorage.setItem(orgKey(username), JSON.stringify(orgs))
  }, [orgs, username])

  // reopen the last workspace after login or refresh
  useEffect(() => {
    if (!token) return
    const last = localStorage.getItem('dispatch_last_org') || orgs[0]?.id
    if (last) openOrg(last)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const isAdmin = !!currentOrg && !!userId && String(currentOrg.admin) === String(userId)

  // everyone who can be assigned a card: the admin plus members
  const people = useMemo(() => {
    if (!currentOrg) return []
    const adminId = String(currentOrg.admin)
    const admin = { id: adminId, username: adminId === String(userId) ? username : 'Workspace admin', admin: true }
    return [admin, ...currentOrg.members.filter((m) => String(m.id) !== adminId)]
  }, [currentOrg, userId, username])

  function handleSignedIn(tok, uname) {
    localStorage.setItem('dispatch_token', tok)
    localStorage.setItem('dispatch_username', uname)
    setOrgs(loadOrgs(uname))
    setUsername(uname)
    setToken(tok)
  }

  function handleSignOut() {
    localStorage.removeItem('dispatch_token')
    localStorage.removeItem('dispatch_username')
    localStorage.removeItem('dispatch_last_org')
    setToken(null)
    setUsername('')
    setOrgs([])
    setCurrentOrg(null)
    setBoards([])
    setCurrentBoard(null)
    setIssues([])
    setModal(null)
    setActiveIssueId(null)
  }

  async function openOrg(orgId, keepBoard = false) {
    try {
      const { organization: org } = await api.getOrg(orgId)
      const { allboards } = await api.getBoards(orgId)
      setCurrentOrg(org)
      setBoards(allboards || [])
      if (!keepBoard) {
        setCurrentBoard(null)
        setIssues([])
      }
      localStorage.setItem('dispatch_last_org', orgId)
      setOrgs((prev) =>
        prev.some((o) => o.id === orgId)
          ? prev.map((o) => (o.id === orgId ? { ...o, title: org.title } : o))
          : [...prev, { id: orgId, title: org.title }],
      )
    } catch (err) {
      notify(err.message, true)
    }
  }

  async function createOrg({ title, description }) {
    try {
      const data = await api.createOrg(title, description)
      notify('Workspace created')
      await openOrg(data.id)
    } catch (err) {
      notify(err.message, true)
    }
  }

  async function createBoard({ title }) {
    try {
      const data = await api.createBoard(title, currentOrg.id)
      const { allboards } = await api.getBoards(currentOrg.id)
      setBoards(allboards || [])
      notify('Board created')
      if (data.board) openBoard(data.board)
    } catch (err) {
      notify(err.message, true)
    }
  }

  async function loadIssues(boardId) {
    try {
      const data = await api.getIssues(boardId)
      setIssues(data.issues || [])
    } catch (err) {
      notify(err.message, true)
    }
  }

  function openBoard(board) {
    setCurrentBoard(board)
    setIssues([])
    loadIssues(board._id)
  }

  function goHome() {
    setCurrentBoard(null)
    setIssues([])
    setActiveIssueId(null)
  }

  async function createIssue({ title, status }) {
    try {
      const { issue } = await api.createIssue({ title, description: '', boardId: currentBoard._id })
      // the API always creates cards as TODO, so move it if it was added to another list
      if (status && status !== 'TODO') await api.updateIssue({ issueId: issue._id, status })
      await loadIssues(currentBoard._id)
    } catch (err) {
      notify(err.message, true)
    }
  }

  async function patchIssue(issueId, patch) {
    setIssues((prev) => prev.map((i) => (i._id === issueId ? { ...i, ...patch } : i)))
    try {
      await api.updateIssue({ issueId, ...patch })
    } catch (err) {
      notify(err.message, true)
      loadIssues(currentBoard._id)
    }
  }

  async function addMember(memberusername) {
    try {
      await api.addMember(currentOrg.id, memberusername)
      notify('Member added')
      await openOrg(currentOrg.id, true)
    } catch (err) {
      notify(err.message, true)
    }
  }

  async function removeMember(memberusername) {
    try {
      await api.removeMember(currentOrg.id, memberusername)
      notify('Member removed')
      await openOrg(currentOrg.id, true)
    } catch (err) {
      notify(err.message, true)
    }
  }

  if (!token) return <AuthScreen onSignedIn={handleSignedIn} />

  const activeIssue = issues.find((i) => i._id === activeIssueId)
  const close = () => setModal(null)

  return (
    <div className="shell">
      <Topbar
        orgs={orgs}
        currentOrgId={currentOrg?.id}
        hasOrg={!!currentOrg}
        onSelectOrg={openOrg}
        onNewOrg={() => setModal('org')}
        onJoinOrg={() => setModal('join')}
        onMembers={() => setModal('members')}
        onNewBoard={() => setModal('board')}
        onSignOut={handleSignOut}
        onHome={goHome}
      />

      <main className={`stage${currentBoard ? ' on-board' : ''}`} style={currentBoard ? { background: boardGradient(currentBoard._id) } : undefined}>
        {!currentOrg && (
          <Welcome orgs={orgs} onOpenOrg={openOrg} onNewOrg={() => setModal('org')} onJoinOrg={() => setModal('join')} />
        )}
        {currentOrg && !currentBoard && (
          <BoardsHome org={currentOrg} boards={boards} onOpenBoard={openBoard} onNewBoard={() => setModal('board')} />
        )}
        {currentOrg && currentBoard && (
          <BoardView
            board={currentBoard}
            org={currentOrg}
            issues={issues}
            people={people}
            onBack={goHome}
            onMembers={() => setModal('members')}
            onCreateIssue={createIssue}
            onPatch={patchIssue}
            onOpenCard={setActiveIssueId}
          />
        )}
      </main>

      {modal === 'board' && (
        <FormModal
          title="Create board"
          submitLabel="Create board"
          fields={[{ name: 'title', label: 'Board title', required: true }]}
          onSubmit={createBoard}
          onClose={close}
        />
      )}
      {modal === 'org' && (
        <FormModal
          title="Create workspace"
          submitLabel="Create workspace"
          fields={[
            { name: 'title', label: 'Workspace name', required: true },
            { name: 'description', label: 'Description' },
          ]}
          onSubmit={createOrg}
          onClose={close}
        />
      )}
      {modal === 'join' && (
        <FormModal
          title="Join with workspace ID"
          submitLabel="Join workspace"
          hint="The workspace admin must add your username first."
          fields={[{ name: 'id', label: 'Workspace ID', required: true }]}
          onSubmit={({ id }) => openOrg(id)}
          onClose={close}
        />
      )}
      {modal === 'members' && currentOrg && (
        <MembersModal org={currentOrg} people={people} isAdmin={isAdmin} onAdd={addMember} onRemove={removeMember} onClose={close} />
      )}
      {activeIssue && (
        <CardModal key={activeIssue._id} issue={activeIssue} people={people} onPatch={patchIssue} onClose={() => setActiveIssueId(null)} />
      )}

      <Toast data={toast} />
    </div>
  )
}

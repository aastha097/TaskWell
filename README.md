# TaskWell

A Trello-style project board app. Workspaces contain boards, and boards contain cards that move through To do, In progress and Done. Node/Express/MongoDB API with a React (Vite) frontend.

## Features

- Sign up and log in (bcrypt + JWT)
- Workspaces with an admin and members
- Boards per workspace
- Cards with title, description, status and assignee
- Drag and drop between lists
- Responsive layout

## Project structure

```
boardwalk/
├── backend/
│   ├── index.js        routes, auth middleware, server entry
│   ├── models.js       Mongoose schemas and DB connection
│   └── package.json
└── frontend/
    ├── index.html
    ├── vite.config.js  dev server pinned to port 3001
    └── src/
        ├── App.jsx     top-level state and views
        ├── api.js      fetch wrapper for every backend route
        ├── styles.css
        └── components/ AuthScreen, Topbar, Welcome, BoardsHome,
                        BoardView, CardModal, MembersModal, FormModal,
                        Modal, Avatar, Logo, Icons, Toast
```

## Run locally

Requires Node.js 18+ and a MongoDB connection (local or Atlas).

**Backend**

```bash
cd backend
npm install
```

Create `backend/.env`:

```
MONGO_URL=mongodb://localhost:27017/trelloapp
JWT_SECRET=replace_with_a_long_random_string
FRONTEND_URL=http://localhost:3001
```

```bash
node index.js     # http://localhost:3000
```

**Frontend**

```bash
cd frontend
npm install
npm run dev       # http://localhost:3001
```

## Deployment

| Where | Setting | Value |
|-------|---------|-------|
| Backend host | `MONGO_URL` | MongoDB Atlas connection string |
| Backend host | `JWT_SECRET` | long random string |
| Backend host | `FRONTEND_URL` | your frontend URL(s), comma-separated, no trailing slash |
| Vercel | `VITE_API_URL` | your backend's `https://` URL, no trailing slash |

Redeploy the frontend after changing `VITE_API_URL`, because Vite reads it at build time.

## API reference

`✔` routes need a `token` header, returned by `/signin`.

| Method | Route | Auth | Body / query |
|--------|-------|------|--------------|
| POST | `/signup` | – | `username`, `password` |
| POST | `/signin` | – | `username`, `password` → `token` |
| POST | `/organization` | ✔ | `title`, `description` |
| GET | `/organization?organizationId=` | ✔ | member or admin only |
| POST | `/add-member-to-organization` | ✔ admin | `organizationId`, `memberusername` |
| DELETE | `/members` | ✔ admin | `organizationId`, `memberusername` |
| GET | `/members?organizationId=` | ✔ admin | – |
| POST | `/board` | ✔ member | `title`, `organizationId` |
| GET | `/boards?organizationId=` | ✔ member | – |
| POST | `/issue` | ✔ member | `title`, `description`, `boardId`, `assignedTo` |
| GET | `/issues?boardId=` | ✔ member | – |
| PUT | `/issues` | ✔ member | `issueId` plus any of `title`, `description`, `status`, `assignedTo` |

## Known limitations

- There is no "list my workspaces" route, so the frontend remembers workspace IDs per user in `localStorage`. Use **Join with workspace ID** for workspaces you were added to.
- `POST /issue` always creates cards as `TODO`. The frontend follows up with a status update when a card is added to another list.
- Admin-only controls are hidden for non-admins in the UI, and the server enforces them.

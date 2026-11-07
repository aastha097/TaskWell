# Trello frontend

React (Vite) frontend for the Express/MongoDB backend, styled after Atlassian Trello.

```bash
npm install
npm run dev     # http://localhost:3001 (pinned; backend CORS expects it)
```

Start the backend (`node index.js`, port 3000) first. Override the API address with `VITE_API_URL`.

## Notes

- The API has no "list my workspaces" route, so workspace IDs are remembered per user in `localStorage`. Use **Join with workspace ID** for workspaces someone added you to.
- `POST /issue` always creates cards as `TODO`, so the app follows it with a status update when you add a card to another list.
- Admin-only controls (add/remove member) are hidden for non-admins; the server still enforces them.

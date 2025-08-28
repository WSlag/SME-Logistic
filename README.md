# Trabaho Abroad PH

A simple job placement website for Filipino job seekers wanting to work abroad. Built with Node.js/Express and a lightweight static frontend.

## Features
- Job listings with search, country and category filters
- Job details endpoint
- Application form posting to backend (stored in `data/applications.json`)
- Mobile-first responsive UI

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```
Then open `http://localhost:3000` in your browser.

3. Build/Run (production):
```bash
npm start
```

## Project Structure
```
src/server.js          # Express server
public/                # Frontend (index.html, styles.css, main.js)
data/jobs.json         # Seed jobs
data/applications.json # Generated when applications are submitted
package.json           # Scripts and dependencies
```

## Notes
- This demo uses filesystem JSON for simplicity. Swap to a database (e.g., PostgreSQL, MongoDB) for production.
- Add authentication and admin dashboard to manage postings in a real deployment.
- Always follow legal and ethical recruitment practices. Avoid illegal fees and ensure transparent terms.
# ResumeBuild

Modern resume builder with a React frontend and Node.js/Express backend. Users can register, create and edit resumes, and export a polished PDF.

## Tech Stack
- Client: React (Vite), Context API, Axios
- Server: Node.js, Express, Mongoose, JWT Auth, pdfkit
- Database: MongoDB

## Features
- Authentication (register/login) with JWT and hashed passwords
- Create, read, update, delete resumes
- Polished PDF export with styled header, sidebar, section dividers, and timeline layout
- Protected API routes and guarded frontend routes
- Centralized API client and routes
- Image upload: Removed for security and simplicity

## Project Structure
```
ResumeBuild/
  client/frontend/
    src/
      components/, pages/, context/, utils/, config/
  server/
    controller/, routes/, models/, middleware/, config/
```

## Prerequisites
- Node.js 18+
- MongoDB running locally or a cloud URI

## Environment Variables
Create a `.env` file in `server/`:
```
MONGODB_URL=mongodb://localhost:27017/resume
JWT_SECRET=replace_with_strong_secret
PORT=4000
CLIENT_ORIGIN=http://localhost:5173
```

Notes:
- `.env` files are ignored by git via `.gitignore`.
- `JWT_SECRET` is required; the server will error if missing.

## Install & Run
From the project root:

### Server
```
cd server
npm install
npm run start
```

### Client
```
cd client/frontend
npm install
npm run dev
```

Then open `http://localhost:5173`.

## API Overview

Base URL: `http://localhost:4000`

Auth
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/profile` (requires `Authorization: Bearer <token>`)

Resume
- POST `/api/resume` (create)
- GET `/api/resume` (list for current user)
- GET `/api/resume/:id` (get by id)
- PUT `/api/resume/:id` (update)
- DELETE `/api/resume/:id` (delete)
- GET `/api/resume/:id/pdf` (download PDF)

## PDF Export
- Implemented in `server/controller/resumeController.js` (`getResumePdf`).
- Styles include: colored header, sidebar for left column, section dividers, and timeline bullets.
- Uses the resume's `colorPalette` if present; otherwise defaults to a modern blue/gray.

## Security & Hardening
- Requires `JWT_SECRET` from env; no insecure defaults.
- `MONGODB_URL` validated and used safely.
- CORS restricted via `CLIENT_ORIGIN` (default `http://localhost:5173`).
- Image upload feature removed; static `/uploads` disabled.

## Troubleshooting
- 500 on PDF download: ensure `pdfkit` is installed in `server` and restart the server.
- Auth 401: your token might be expired; log in again.
- Mongo connection error: verify `MONGODB_URL` and that MongoDB is running.
- CORS issues: confirm `CLIENT_ORIGIN` matches your client dev URL.

## Scripts
Server (`server/package.json`):
- `npm run start` - start server
- `npm run server` - start with nodemon

Client (`client/frontend/package.json`):
- `npm run dev` - start Vite dev server

## License
MIT



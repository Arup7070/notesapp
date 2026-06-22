# NotesApp Project Documentation

## 1. Project Overview

**NotesApp** is a college-level notes management application built with a React frontend and a Node.js/Express backend. It supports user registration, login, secure JWT authentication, note creation, editing, deletion, pinning, and search functionality. The backend stores users and notes in MongoDB.

## 2. Objective

The goal of this project is to create a full-stack note-taking web application that demonstrates:
- user authentication and authorization
- CRUD operations for notes
- secure handling of secrets using environment variables
- client-server communication via RESTful APIs
- a responsive React UI with modern tooling (Vite, Tailwind CSS, React Router)

## 3. Tech Stack

- Frontend:
  - React
  - Vite
  - React Router DOM
  - Axios
  - Tailwind CSS
  - React Icons
  - React Modal
- Backend:
  - Node.js
  - Express.js
  - MongoDB (via Mongoose)
  - dotenv
  - bcrypt
  - jsonwebtoken
  - CORS
- Development tooling:
  - nodemon
  - cross-env
  - ESLint

## 4. Folder Structure

```
NotesApp/
  package.json
  backend/
    server.js
    config/
      db.js
      .env
    controls/
      notes.controls.js
      user.control.js
    models/
      notes.model.js
      user.model.js
    routes/
      notes.route.js
      user.route.js
    utilities/
      util.js
  frontend/
    package.json
    index.html
    vite.config.js
    src/
      main.jsx
      App.jsx
      index.css
      components/
        EmptyCard.jsx
        Navbar.jsx
        NoteCard.jsx
        PasswordInput.jsx
        ProfileInfo.jsx
        SearchBar.jsx
        TagInput.jsx
        Toast.jsx
      pages/
        AddEditNotes.jsx
        Home.jsx
        Login.jsx
        NotFound.jsx
        SignUp.jsx
      utils/
        axiosInstance.js
        constants.js
        helper.js
```

## 5. Backend Architecture

### 5.1 Entry Point

- `backend/server.js`
  - Loads environment variables from `backend/config/.env`
  - Configures Express middleware: JSON parsing and CORS
  - Registers API routes for authentication and note operations
  - Serves the frontend build in production
  - Connects to MongoDB before starting the server

### 5.2 Configuration

- `backend/config/db.js`
  - Uses Mongoose to connect to MongoDB
  - Reads `CONNECTION_STRING` from environment variables
  - Supports DNS server configuration for Atlas SRV connections

### 5.3 Models

- `backend/models/user.model.js`
  - User schema fields:
    - `name`: String, required
    - `email`: String, unique
    - `password`: String, required
    - `createdOn`: Date, default current timestamp

- `backend/models/notes.model.js`
  - Note schema fields:
    - `title`: String, required
    - `content`: String, required
    - `tags`: [String], default []
    - `isPinned`: Boolean, default false
    - `userId`: String, required
    - `createdOn`: Date, default current timestamp

### 5.4 Controls / Business Logic

- `backend/controls/user.control.js`
  - `addUser`:
    - Validates registration inputs
    - Checks for existing email
    - Hashes password with bcrypt
    - Saves new user
    - Returns a JWT access token
  - `logIn`:
    - Validates login inputs
    - Verifies user by email
    - Checks password with bcrypt
    - Returns a JWT token on success
  - `getUser`:
    - Retrieves authenticated user details
    - Returns user data excluding password

- `backend/controls/notes.controls.js`
  - `addNotes`:
    - Creates a new note for the authenticated user
  - `editNotes`:
    - Updates an existing note owned by the user
  - `getAllNotes`:
    - Fetches notes for the authenticated user
    - Sorts notes so pinned notes appear first
  - `deleteNotes`:
    - Deletes a user-owned note
  - `updateIsPinned`:
    - Toggles note pinned state
  - `searchNote`:
    - Searches a user's notes by title, content, or tags using case-insensitive regex

### 5.5 Routes

- `backend/routes/user.route.js`
  - `POST /api/user/create-account`
  - `POST /api/user/login`
  - `GET /api/user/get-user` (requires auth token)

- `backend/routes/notes.route.js`
  - `POST /api/notes/add`
  - `PUT /api/notes/edit/:id`
  - `PUT /api/notes/pin/:id`
  - `GET /api/notes/search` (query parameter `query`)
  - `DELETE /api/notes/delete/:id`
  - `GET /api/notes/` (retrieve all notes)

### 5.6 Authentication Middleware

- `backend/utilities/util.js`
  - Extracts the JWT token from the `Authorization` header
  - Verifies token with `ACCESS_TOKEN_SECRET`
  - Attaches decoded user payload to `req.user`
  - Protects note and user endpoints

## 6. Frontend Architecture

### 6.1 Application Bootstrapping

- `frontend/src/main.jsx`
  - Mounts the React app into the DOM
  - Renders `App` inside `StrictMode`

- `frontend/src/App.jsx`
  - Defines React Router routes:
    - `/` → `Home`
    - `/login` → `Login`
    - `/signup` → `SignUp`
    - `*` → `NotFound`

### 6.2 Page Components

- `Home.jsx`
  - Displays user notes and controls
  - Loads note list and user data on mount
  - Supports search, delete, pin, and modal creation/editing
  - Uses `Navbar`, `NoteCard`, `AddEditNotes`, `EmptyCard`, and `Toast`

- `Login.jsx`
  - Allows users to log in with email and password
  - Validates inputs
  - Stores JWT token in `localStorage`
  - Redirects to home page on success

- `SignUp.jsx`
  - Allows new users to register
  - Validates name, email, and password
  - Stores JWT token and redirects to home on success

- `AddEditNotes.jsx`
  - Modal form for creating or editing notes
  - Supports title, content, and tags
  - Communicates with note API endpoints

- `NotFound.jsx`
  - Displays a 404-style image when a route does not exist

### 6.3 Reusable Components

- `Navbar.jsx`
  - Displays app name
  - Shows search bar and login/logout state
  - Allows logout and navigation

- `NoteCard.jsx`
  - Displays individual note details
  - Shows title, date, content preview, tags, and pin/delete/edit actions

- `TagInput.jsx`
  - Adds and removes note tags dynamically

- `SearchBar.jsx`
  - Accepts search input and triggers note search

- `PasswordInput.jsx`
  - Toggles password visibility in login/signup forms

- `ProfileInfo.jsx`
  - Displays user initials and logout button

- `EmptyCard.jsx`
  - Shows an empty state graphic and message when there are no notes

- `Toast.jsx`
  - Displays temporary success or delete notifications

### 6.4 Utilities

- `frontend/src/utils/axiosInstance.js`
  - Configures Axios base URL based on development environment
  - Adds JWT token to request headers automatically

- `frontend/src/utils/constants.js`
  - Provides `BASE_URL` for API requests

- `frontend/src/utils/helper.js`
  - Email validation helper
  - Name initials generator helper

## 7. Environment Variables

The backend requires the following environment variables in `backend/config/.env`:

- `CONNECTION_STRING` — MongoDB connection string
- `ACCESS_TOKEN_SECRET` — secret used to sign JWT tokens
- `PORT` — optional server port (default `5000`)
- `NODE_ENV` — optional environment mode (`development` or `production`)
- `DNS_SERVERS` — optional DNS servers for MongoDB SRV resolution

Example:

```env
ACCESS_TOKEN_SECRET=your_jwt_secret_here
CONNECTION_STRING="mongodb+srv://<user>:<password>@cluster0.mongodb.net/<database>?retryWrites=true&w=majority"
PORT=5000
```

## 8. How to Run the Project

### 8.1 Install Dependencies

From the project root:

```bash
npm install
npm install --prefix frontend
```

### 8.2 Start Backend

```bash
npm run dev
```

### 8.3 Start Frontend

```bash
npm run dev --prefix frontend
```

### 8.4 Build for Production

```bash
npm run build
```

### 8.5 Start Production Server

```bash
npm start
```

## 9. Application Features

- User registration and login
- JWT-based authentication
- Secure password hashing with bcrypt
- Add, edit, delete, and pin notes
- Search notes by title, content, and tags
- Tag management for notes
- User-specific note storage
- Responsive frontend layout with modern React patterns

## 10. API Endpoints Summary

- `POST /api/user/create-account` — register a new user
- `POST /api/user/login` — authenticate a user
- `GET /api/user/get-user` — retrieve current user details
- `POST /api/notes/add` — add a new note
- `PUT /api/notes/edit/:id` — edit an existing note
- `PUT /api/notes/pin/:id` — pin or unpin a note
- `GET /api/notes/search?query=<text>` — search notes
- `DELETE /api/notes/delete/:id` — delete a note
- `GET /api/notes/` — get all notes for the authenticated user

## 11. Notes on Security

- Passwords are stored as bcrypt hashes in MongoDB.
- JWT tokens are stored in browser `localStorage` and sent via the `Authorization` header.
- Protected routes require a valid JWT for access.

## 12. Future Improvements

- Add password reset functionality
- Add note categories or folders
- Improve frontend validation and error display
- Add pagination for large note collections
- Add user profile editing and avatars
- Implement dark mode

## 13. Conclusion

This NotesApp demonstrates a complete full-stack project with user authentication, CRUD operations, secure backend integration, and a modern React-based frontend. It is suitable for a college examination submission as it shows both architectural design and implementation details.

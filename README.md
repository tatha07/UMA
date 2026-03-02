# UMA AI — Maternal & Child Health Assistant

This repository contains a small two-part application:

- A React + Vite frontend (this folder) that provides the UI.
- An Express backend (in the `backend/` folder) that proxies requests to the Google GenAI SDK and exposes a single chat endpoint used by the frontend.

UMA (the assistant) is an empathetic maternal and child health guide powered by Google's GenAI via the `@google/genai` package. The backend applies a system prompt to steer UMA's tone and behavior.

This README covers how to run the project locally, the backend API contract, and helpful notes.

## Repository structure

- [frontend/](./) — React + Vite app. Run with `npm run dev`.
- [backend/](../backend) — Express server implemented in `dimaag.js` that calls Google GenAI.

## Prerequisites

- Node.js (v18+ recommended)
- npm (or yarn)
- A Google GenAI API key (set as `API_KEY` in the backend `.env`)

## Backend: configuration & run

1. Open a terminal and install dependencies:

```bash
cd backend
npm install
```

2. Create a `.env` file in the `backend/` folder with at least:

```
API_KEY=your_google_genai_api_key_here
PORT=5000   # optional, defaults to 5000
```

3. Start the backend:

```bash
node dimaag.js
```

The backend listens by default on port `5000` and exposes `POST /api/chat`.

### Backend API

- Endpoint: `POST /api/chat`
- Request JSON: `{ "message": "<user message>" }`
- Response JSON: `{ "reply": "<uma reply text>" }`

Example using `curl`:

```bash
curl -X POST http://localhost:5000/api/chat \
	-H "Content-Type: application/json" \
	-d '{"message":"Hi, I need pregnancy advice"}'
```

The server will forward the message to Gemini via the `@google/genai` SDK and return UMA's text reply.

## Frontend: run

1. From the repository root (or inside `frontend/`) install dependencies and start dev server:

```bash
cd frontend
npm install
npm run dev
```

Vite typically serves the app on `http://localhost:5173`.

## Notes & disclaimer

- UMA is an assistant and not a replacement for professional medical advice. Always consult a qualified healthcare professional for diagnosis and emergencies.
- The backend uses a system prompt to guide UMA's tone and behavior; review `backend/dimaag.js` if you need to adjust instructions.

## Contributing

If you'd like to improve UMA, open an issue or submit a pull request. For backend changes that touch credentials or external APIs, avoid committing secrets — use `.env`.

## Files of interest

- [backend/dimaag.js](../backend/dimaag.js) — main Express server and system prompt.
- [frontend/src/](./src) — React app source.

---

# React.js and Node.js fullstack app

---

## 1. What the project is

A small full-stack app for creating **property classifieds**. It has two views: 
- The **NewProperty** page (`/`) renders a Form component for the user to create a new property classified.
- The **Properties** page (`/properties`) which renders a (hardcoded) list of property cards, for the user to view all his properties classifieds. 

<br/>

---

## 2. Tech stack

### `client/`
| Area               | Choice                                                            |
|--------------------|-------------------------------------------------------------------|
| Framework          | React 19 + TypeScript                                             |
| Build / dev server | Vite 8                                                            |
| Routing            | React Router 8                                                    |
| Forms & validation | react-hook-form + Zod 4 (`@hookform/resolvers`)                   |
| UI components      | shadcn/ui (Radix), reui (Autocomplete) , sonner (toasts)          |
| Styling            | Tailwind CSS 4, Roboto font                                       |
| Testing            | Vitest + Testing Library                                          |
| Linters            | ESLint, Prettier                                                  |

### `server/`
| Area       | Choice                                                                      |
|------------|-----------------------------------------------------------------------------|
| Runtime    | Node.js 22 — runs TypeScript directly                                       |
| Framework  | Express 5                                                                   |
| Validation | Zod 4                                                                       |
| Config     | dotenv (`.env.local` overrides `.env`)                                      |
| Testing    | Vitest + Supertest                                                          |

### `shared/`
- Plain TypeScript types (`ListingType`, `Area`, `PropertyInput`, `Property`) used by both sides.
- **No dependencies** — nothing to install. The client imports it via the `@shared` alias,
  the server via a local `file:../shared` dependency.
- Each side's Zod schema is checked against these types at compile time
  (`satisfies z.ZodType<PropertyInput>`), so the rules are always in sync.

<br/>

---

## 3. Folder structure

```
xe-code-challenge/
├── client/                     React app (Vite)
│   ├── src/
│   │   ├── api/                fetch wrappers: getAreas, getProperties, saveProperty
│   │   ├── components/
│   │   │   ├── Form.tsx        the property form
│   │   │   ├── ui/             shadcn components (button, card, input, select, …)
│   │   │   └── reui/           Autocomplete component
│   │   ├── hooks/              useAreaSearch (debounced area search), useDebounce
│   │   ├── pages/              NewProperty (/), Properties (/properties)
│   │   ├── schema/             form validation schema (Zod)
│   │   ├── types/              re-exports the shared types
│   │   ├── test/setup.ts       test setup (jest-dom, jsdom stand-ins)
│   │   ├── App.tsx             routes + toaster
│   │   ├── main.tsx            entry point, router
│   │   └── index.css           Tailwind + theme colours/tokens
│   └── vite.config.ts          aliases (@, @shared), /api dev proxy, test config
├── server/                     Express API
│   ├── index.ts                loads env files, starts the server
│   ├── app.ts                  Express app (middleware + routes), imported by tests
│   └── src/
│       ├── routes/             /api/areas, /api/properties (+ tests)
│       ├── schema/             request/response validation (Zod)
│       ├── db/localDb.ts       in-memory store
│       ├── types/              response/error types
│       └── utils/handleError.ts  consistent error responses
└── shared/
    └── types/property.ts       types shared by client and server
```

<br/>

---

## 4. How the client and server communicate
- The client calls **relative URLs** (`/api/...`). In development, Vite's dev server **proxies**
  every `/api` request to `http://localhost:9000` (see `client/vite.config.ts`).
  → The server must run on **port 9000** in development (`APP_PORT=9000`).
- The browser never calls the external areas API directly: the server forwards the search to
  `API_URL` (from `server/.env.local`) with `fetch`, validates the response with Zod and returns
  only `{ placeId, mainText, secondaryText }`. This keeps the API URL private and avoids CORS issues.

### Endpoints
| Method | Path | What it does | Responses |
|---|---|---|---|
| GET | `/api/areas?input=<text>` | Searches the external areas API. Inputs shorter than 3 characters return `[]` without calling it. | `200` `Area[]` · forwards the external API's error status · `500` |
| GET | `/api/properties` | Lists all saved properties. | `200` `Property[]` · `500` |
| POST | `/api/properties` | Validates the body, adds `id` (UUID) and `createdAt` (ISO date), saves it. | `201` `Property` · `400` invalid input · `500` |

### Error format
Every error response has the same shape (`server/src/utils/handleError.ts`):
```json
{
  "message": "Invalid property.",
  "status": 400,
  "debugMessage": "…details, or null…",
  "timestamp": "2026-10-01T12:00:00.000Z"
}
```
The client shows `message` in a toast.

### Area search flow
1. The user types in the Area field; the input is **debounced** so a search runs only
   when they pause.
2. Under 3 characters → no request.
3. A new search **aborts** the previous one (`AbortController`), so stale results never
   overwrite newer ones.
4. Picking a suggestion stores the full `Area` object in the form; editing the text afterwards
   clears it, so free text can't be submitted.

<br/>

---

## 5. The local database (`server/src/db/localDb.ts`)

- An **in-memory array** — no real database.
- **Data is lost when the server restarts.** It starts with 3 sample listings each time, so the
  listings page isn't empty.
- Exposes `addProperty()` and `getProperties()`. Routes only use these two functions, so
  replacing it with a real database only changes this file (the routes already have try/catch
  for database errors).

<br/>

---

## 6. Running the project

### Requirements
- **Node.js 22** (see `.nvmrc`; `nvm use`)
- An **areas API URL** for `API_URL` (not committed. Should be included to a `.env.local` file)

### Environment variables (`server/`)
`server/.env` is committed with **empty values** as a template. Put the real values in
**`server/.env.local`** (git-ignored; it overrides `.env`):
```
API_URL=<areas API url>
APP_PORT=9000
```

### Install
```sh
cd server && npm install   # also links the shared/ folder
cd ../client && npm install
# shared/ has no dependencies — nothing to install
```

### Development
Two terminals:
```sh
cd server && npm start      # API on http://localhost:9000 (restart it after server changes)
cd client && npm run dev    # app on http://localhost:5173, /api proxied to :9000
```

### Production build
```sh
cd client && npm run build  # type-checks, then builds static files into client/dist/
cd server && npm start      # same as dev: Node runs the TypeScript directly
```
- Try the production client locally with `cd client && npm run preview` (http://localhost:4173);
  it uses the same `/api` proxy as dev.
- **Deploying:** the client is static files (`client/dist`), the server a Node process.
    - The client calls relative `/api` URLs, so in production something must route `/api` to the
      server (a reverse proxy, or the host's rewrite rules).
    - The server needs **`shared/` next to `server/`** at runtime too (it isn't compiled), e.g. a
      Docker build must use the repo root as its context and copy both folders.

### Tests & checks
```sh
cd client && npm test       # Vitest (watch mode); `npx vitest run` for a single run
cd client && npm run lint
cd server && npm test
npm run format:check        # in either project
```

<br/>

---

## 7. Testing

### Tools
- **Vitest** in both projects.
- **Client:** Testing Library (`@testing-library/react`, `user-event`, `jest-dom` matchers) in a
  **jsdom** browser environment. `src/test/setup.ts` adds the jest-dom matchers, cleans up after
  each test, and stubs browser APIs jsdom lacks (`ResizeObserver`, `hasPointerCapture`,
  `scrollIntoView`) that the Radix/Base UI components need.
- **Server:** **Supertest** sends real HTTP requests to the Express app. Tests import `app.ts`
  (not `index.ts`), so no server is started and no port is used.

### What's covered

**Client**

| File | What it checks |
|---|---|
| `src/schema/form.test.ts` | The validation rules on their own, field by field: required fields, title trimming and 155-char limit, each listing type, area must be a picked suggestion (free text and a missing `placeId` fail), price must be a whole number > 0, optional description; an untouched form is invalid. Checks the exact error **messages**, not just pass/fail. |
| `src/api/areas.test.ts` | `getAreas()`: builds the URL and encodes the query, passes the `AbortSignal` to `fetch`, throws the server's error `message`, falls back to a generic message when the error body isn't JSON or has no message, and passes network errors through. |
| `src/components/Form.test.tsx` | The form as a user uses it: all fields render and are linked to their labels; submitting shows the validation errors; the area autocomplete doesn't search under 3 characters, shows suggestions (one debounced search, not one per key), and accepts a picked suggestion without searching again; Reset clears every field and the errors. |

**Server**

| File | What it checks |
|---|---|
| `src/routes/areas.test.ts` | `GET /api/areas`: returns validated areas and calls the external API with the encoded input; an empty result is `200 []`; missing / blank / too short input returns `[]` **without** calling the external API; an external error status is forwarded; invalid external data and network failures become a `500` in the standard error format. |


<br/><br/><br/><br/>

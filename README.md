## Features
- Swipe a card right to like and left to pass. Drag on mobile, buttons and arrow keys on desktop.
- A swiped profile no comes back, and swipes and matches survive a reload.
- Sealed note: one optional line, up to 120 characters, written when you like someone.
- Intent: every like carries one of three levels, getting to know each other, dating or something long-term.
- The "It's a match!" screen and a Matches list show both notes and both intents.

## Quick start

```bash
pnpm i && cp .env.example .env
pnpm seed && pnpm dev
```
For Seeding It's must have a db url connected

## Architecture
- `src/app`: the pages and the three route handlers.
- `src/discover`: the feature. Schema, SQL and the UI live together.
- `src/infra`: env check, the database client, the error wrapper and the seed script.
- `src/web`: the shared Axios instance and the fetch hook.
## API
- `GET /api/feed`: profiles you have not swiped on.
- `POST /api/swipe`: `{ profileId, action: "pass" }` or `{ profileId, action: "like", intent, note? }`. Returns `{ matched, match? }`.
- `GET /api/matches`: our mutual matches with both notes and intents.

## Tech stack
- Next.js: the web app and the API routes
- pg: the Postgres client, raw SQL with no ORM
- react-tinder-card: swipe gestures
- Tailwind CSS v4: styling
- Zod: request validation
- Axios: data fetching

Thanks.
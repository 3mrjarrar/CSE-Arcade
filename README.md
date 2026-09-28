# CSE Arcade

A lightweight, responsive React arcade with three games:

- Questions: choose a study year (1–5) and proficiency level. Each combination draws five questions from six supplied questions, for 90 questions in total.
- Sequence ordering: arrange seven startup steps to open the course registration portal.
- Binary elevator: answer five binary/decimal conversions in 20 seconds to reach the fifth-floor lab.

## Run

```sh
npm install
npm run dev
```

`npm run build` creates the production site in `dist`. `npm run preview` previews that build. `npm test` checks the game logic and question sets.

Only React and React DOM are runtime dependencies; Vite is the build tool. No backend, tracking, external fonts, or UI libraries are required. Edit `src/questions.js` to adapt the supplied questions.

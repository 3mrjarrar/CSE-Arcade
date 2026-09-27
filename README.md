# CSE Arcade

A lightweight, responsive React arcade with one complete questions game. Select a study year (1–5), then a proficiency (beginner, intermediate, advanced). Each combination has five distinct questions, for 75 total. Finish a round to see your score and review answers.

## Run

```sh
npm install
npm run dev
```

`npm run build` creates the production site in `dist`. `npm run preview` previews that build. `npm test` checks all question sets.

Only React and React DOM are runtime dependencies; Vite is the build tool. No backend, tracking, external fonts, or UI libraries are required. Questions use a general CSE progression rather than a specific university syllabus. Edit `src/questions.js` to adapt them.

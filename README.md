# Riverdale Science Olympiad Website

A static GitHub Pages site for Riverdale Science Olympiad. It has no build step: GitHub can host it directly from `index.html`.

## Local Preview

From the repository folder:

```bash
python3 -m http.server 8000
```

Then open `http://localhost:8000`.

## GitHub Pages Setup

1. Push this repository to GitHub.
2. In GitHub, open **Settings > Pages**.
3. Set **Source** to **Deploy from a branch**.
4. Choose the `main` branch and the `/root` folder.
5. Save. GitHub will publish the site at the Pages URL shown on that screen.

## Editing Site Content

Most season updates live in one file:

`assets/js/data.js`

Update these sections:

- `TEAM_LEADERS`: names that should be marked as student leaders on the roster.
- `LEADERS_PASSWORD`: the light client-side password for the Leaders page. This is only meant to stop casual access; it is visible in the site files.
- `LEADERS_BUDGET_URL`: the Google Sheets budget link shown on the Leaders page.
- `BUDGET_API_URL`: the deployed Google Apps Script Web App URL used by the Leaders budget frontend.
- `BUDGET_API_TOKEN`: a light shared token sent to the Apps Script API. This is visible in the site files, so it only prevents casual use.
- `STUDENT_PROFILES`: optional leader-only notes and practice test score fields for each student.
- `EVENTS`: event cards, modal descriptions, rule summaries, links, and tips.
- `REGIONAL_EVENTS`, `RIVERDALE_A_SCORES`, `RIVERDALE_B_SCORES`: event order and scores.
- `TEAM_A_ASSIGNMENTS`, `TEAM_B_ASSIGNMENTS`: members assigned to each event.
- `TOP5`: regional top-five placements shown in result modals.
- `COUNTDOWN_EVENTS`: dates for the live countdowns on the Home "Your Season" panel. Edit as the 2026–27 calendar firms up.

## 2026 Experience Layer

A second styling/behavior layer (`assets/css/enhancements.css` + `assets/js/features.js`) adds a set of features on top of the original site. None of it requires a build step or any new dependency — it is plain CSS and vanilla JavaScript, and it reads the same data in `assets/js/data.js`.

- **Command palette** — press `⌘K` / `Ctrl+K` (or `/`) to fuzzy-search every page, event, teammate, resource, and quick action, then jump there with the keyboard.
- **Dark / light theme** — the floating moon/sun button (bottom-right) toggles a full dark theme. The choice is remembered per device and respects the system preference on first visit.
- **Study Hub tab** — flip-card flashcards for all 23 events, a multiple-choice quiz, a Pomodoro focus timer that tracks sessions/minutes, and a season milestone checklist. Flashcards, quiz, timer stats, and milestones all run client-side; progress saves in the browser.
- **SciOly AI tab** — sends a question to the team's Palantir Foundry-backed AI endpoint and displays its answer.
- **Home "Your Season" panel** — pick your name to see your assigned events, prep progress, and live countdowns to the next season's milestones. Saved on the device only.
- **Polish** — cinematic preloader, scroll progress bar, back-to-top button, toast notifications, and confetti on wins (gold medal, completed focus session, finished checklist).

All new data is stored in the browser's `localStorage` only; nothing is uploaded.

### SciOly AI API Setup

The AI form sends this request:

```http
POST /api/scioly-ai
Content-Type: application/json

{"query":"the student's question"}
```

The endpoint should return JSON in the form `{"answer":"the model's answer"}`. Update `SCIOLY_AI_API_URL` near the top of `assets/js/app.js` if the API team provides a different URL. Because this is a public static site, Foundry credentials must stay in the API/backend and must not be added to the website JavaScript.

### Leaders Page Notes

The Leaders page uses the password in `LEADERS_PASSWORD` and remembers access for the current browser session. It is not real security because this is a static GitHub Pages site.

The budget frontend reads from the `UPDATED-SCIOLY Budgets and needs` spreadsheet through a Google Apps Script Web App. Setup instructions and the API script live in [docs/BUDGET_API_SETUP.md](docs/BUDGET_API_SETUP.md).
There is also a public purchase request page in the main nav; the protected Leaders page keeps the same form plus live request/spending cards and status controls.

To add notes or practice test scores, edit `STUDENT_PROFILES`:

```js
const STUDENT_PROFILES = {
  "Student Name": {
    notes: "Add private leader notes here.",
    practiceTests: {
      "Hovercraft": "Score or comment goes here"
    }
  }
};
```

The home-page team photo is stored at:

`assets/images/riverdale-team-2026.jpg`

Replace that file with another browser-friendly image if the team photo changes. Keep the same filename if you do not want to edit HTML.

## File Structure

```text
index.html                  Main GitHub Pages entry point
sciolyedit.html             Redirect for the old file name
assets/css/styles.css       Layout, colors, responsive behavior, transitions
assets/css/enhancements.css Theme engine, command palette, study hub, dark mode
assets/js/data.js           Editable team/event/results data
assets/js/app.js            Rendering, filters, modals, navigation, animations
assets/js/features.js       Command palette, themes, study hub, personalization
assets/images/              Local site images
```

## Publishing Changes

```bash
git status
git add .
git commit -m "Update Science Olympiad website"
git push
```

After pushing to `main`, GitHub Pages will redeploy automatically.

# Dizziness & Imbalance Questionnaire + ChatGPT Differential

## Quick start (local)

```bash
git clone ...
cd dizzy-questionnaire
cp .env.example .env             # add your own key
npm install
npm start
```

Then open <http://localhost:3000> in your browser.

## Deploy on Render

1. Create a new **Web Service** linked to this repo.
2. Build command: `npm install`
3. Start command: `npm start`
4. Add environment variable `OPENAI_API_KEY` (mark as *Secret*).

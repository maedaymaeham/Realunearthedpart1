# Unearthed — Deployment Guide (Free Version)

## The setup
- **Storage**: uses `localStorage` — free, works anywhere, no backend.
- **AI readings/reflections**: turned off (`AI_ENABLED = false` at the top of `src/App.tsx`). Every reading spot already has a genuine, chart-specific fallback that's written from your actual Sun/Moon/Life Path/etc. — it's not generic filler, it just isn't freshly AI-generated each time. Nothing to pay for, nothing to configure.

**This is a fully static site.** No serverless functions, no environment variables, no API key, no per-use cost — ever, unless you choose to turn AI back on later.

## Deploy — three steps

**1. Push to GitHub**
```bash
cd unearthed-app
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/unearthed.git
git push -u origin main
```
(Create the empty repo on GitHub first.)

**2. Deploy on Vercel**
- [vercel.com/new](https://vercel.com/new) → import the repo.
- Vercel auto-detects Vite. Leave everything default.
- Click Deploy. That's it — no env vars needed.

**3. Done**
Every future `git push` to `main` auto-redeploys. Free on Vercel's Hobby tier.

## Running locally
```bash
npm install
npm run dev
```

## If you ever want live AI readings later
Set `AI_ENABLED = true` near the top of `src/App.tsx`, add back a small serverless
function that holds an `ANTHROPIC_API_KEY`, and point the 4 fetch calls at it. Not
something to think about now — the fallback content is genuinely good and costs nothing.

## Known limitation, carried over honestly
Data lives in `localStorage`, scoped to one browser on one device — no accounts, no
cross-device sync. Clearing browser data or switching devices means starting over.
Worth fixing with a real backend only once you know people actually want multi-device
access — not before.

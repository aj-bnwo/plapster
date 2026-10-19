# Plapster ♠

> **Plap it away!**  
> *Crafted with an "Apple Created by Trans Designers" aesthetic. Surrender to the BNWO.*

---

## ♠ About Plapster

**Plapster** is a modern, responsive single-page web app built specifically for the niche community of Plap Vids. Designed around the Trans Pride palette (**Sky Blue `#5BCEFA`**, **Pastel Pink `#F5A9B8`**, and **Pure White `#FFFFFF`**), Plapster combines an ultra-refined Apple frosted light mode interface with a seductive, tactile video roulette engine.

No endless scrolling or decision fatigue: pick your desired **Category** and **Duration**, spin the roulette, and let the algorithm take over.

---

## 🔒 100% Client-Side Privacy

- **Zero Tracking & Zero Analytics:** No cookies, no third-party trackers, no remote analytics.
- **Local Browser Storage:** Watch history, session time, daily streaks, and chosen nickname are stored 100% locally in your browser's `localStorage`.
- **Offline & Private:** Video playback is handled natively on your device without transmitting telemetry.

---

## ♠ Key Features

### 1. Focused Category & Duration Spec Selector
- **Categories:**
  - `WBCH`
  - `Goonlimp`
  - `PMVs`
  - `Plap for Claps`
  - `Hero`
  - `♠ All Categories`
- **Duration Buckets:**
  - `< 1 min` (Quick Plap)
  - `1–5 mins` (Regular Plap)
  - `5–10 mins` (Deep Plap)
  - `10+ mins` (Marathon Plap)
  - `Any Duration`

### 2. Random Plap Roulette & Safe Autoplay
- **Dynamic Prioritization:** The randomizer automatically prioritizes fresh, unplapped videos first; once all have been watched, it cycles through least-recently-watched videos.
- **Safe 4-Second Countdown:** Circular SVG progress ring in Trans Pride dual gradients. Keeps browser user-activation tokens alive to allow unmuted autoplay without blocking.
- **Audio Fallback Badge:** If the browser policy restricts unmuted sound, Plapster seamlessly falls back to muted autoplay and surfaces a frosted **"Tap to Unmute 🔊"** badge.

### 3. Native OS Video Player
- Fullscreen viewport overlay (`backdrop-blur-2xl`) using native HTML5 `<video controls playsInline autoPlay>`.
- Preserves native operating system controls (macOS QuickTime, iOS AVPlayer, Picture-in-Picture, AirPlay) across portrait (9:16) and landscape (16:9) aspect ratios.
- Post-playback action bar offering instant **Replay Plap** or **Next Plap**.

### 4. Live Browser Stats & Streaks
- **Minutes Plapped:** Cumulative time spent watching.
- **Vids Watched:** Track unique videos completed in your collection.
- **Days Streak (🔥):** Daily streak counter recognizing consecutive days plapped.
- **Fresh Queue:** Live counter of unplapped videos waiting in your matching pool.

### 5. First-Time Onboarding & 18+ Age Gate
- Seductive onboarding modal verifying 18+ adult age and asking what nickname to call you (*"Good girl"*, *"Master"*, or your preferred name), with the ability to edit anytime.

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/<your-username>/plapster.git

# Navigate into the project
cd plapster

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open `http://localhost:5173/` in your browser.

---

## 📦 Building for Production & GitHub Pages

Plapster is pre-configured with relative asset paths (`base: './'`) in `vite.config.js` so it works out-of-the-box on GitHub Pages.

### Step 1: Build the production bundle
```bash
npm run build
```
This compiles the application and bundles all video assets into the `dist/` directory.

### Step 2: Deploy to GitHub Pages

#### Option A: Deploy with `gh-pages` (Recommended)

1. Install `gh-pages`:
   ```bash
   npm install -D gh-pages
   ```
2. Add deploy scripts to your `package.json`:
   ```json
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Run:
   ```bash
   npm run deploy
   ```

#### Option B: Deploy with GitHub Actions
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Plapster to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## ♠ Project Creator

- **Creator:** **AJ**
- **Discord:** **`@jsissyjessie`**
- **Palette:** Sky Blue (`#5BCEFA`) • Pure White (`#FFFFFF`) • Pastel Pink (`#F5A9B8`)

> *"Resistance is completely futile, darling. You know you can't stop at just one plap... sink deeper, let go of all control, and let the loop take over your thoughts. ♠"*

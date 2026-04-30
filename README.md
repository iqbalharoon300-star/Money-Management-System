# MyMoney — UAE & Pakistan Money Manager

A fully offline PWA (Progressive Web App) for tracking income, expenses, and remittances between UAE (AED) and Pakistan (PKR). Works 100% on your iPhone with no backend or subscription needed.

---

## Features
- ✅ Income & Expense tracking (AED)
- ✅ Remittance tracking (AED → PKR with live rate)
- ✅ Budget limits per category with progress bars
- ✅ Monthly reports with charts (bar, doughnut, line)
- ✅ Export to CSV
- ✅ Print/PDF report
- ✅ Works 100% offline on iPhone
- ✅ Installable as home screen app

---

## Deploy to GitHub Pages (Free)

### Step 1: Create GitHub Repo
1. Go to github.com → New Repository
2. Name it: `mymoney` (or anything you like)
3. Set to **Public**
4. Click **Create repository**

### Step 2: Upload Files
Upload these 3 files:
- `index.html`
- `manifest.json`
- `sw.js`

### Step 3: Enable GitHub Pages
1. Go to your repo → **Settings**
2. Click **Pages** (left sidebar)
3. Source: **Deploy from a branch**
4. Branch: **main** → folder: **/ (root)**
5. Click **Save**

Your app will be live at:
`https://YOUR-GITHUB-USERNAME.github.io/mymoney/`

(Takes ~2 minutes to go live)

---

## Install on iPhone

1. Open Safari on your iPhone
2. Go to: `https://YOUR-GITHUB-USERNAME.github.io/mymoney/`
3. Tap the **Share button** (box with arrow)
4. Tap **"Add to Home Screen"**
5. Tap **Add**

That's it! The app icon will appear on your home screen. It works offline!

---

## How Data is Stored
All data is saved in your iPhone's browser **localStorage** — it never leaves your device. No account, no cloud, no subscription.

---

## Updating the AED→PKR Rate
Go to **Budget tab** → scroll down to **Rate Settings** → enter current rate → Save.

---

## Built With
- Vanilla HTML/CSS/JavaScript
- Chart.js (charts)
- PWA (offline support)
- localStorage (data storage)

# 🚀 AI Agent Player - Website Deployment Instructions on cPanel

## Problem: ZIP file rejected by antivirus
JavaScript files bundled by React/Vite may be flagged as suspicious by some antivirus scanners.

## Solution: Upload files directly

### Step 1: Create folders
1. Go to cPanel File Manager
2. Navigate to `/home/agentplayer/public_html`
3. Create a new folder named `assets`

### Step 2: Upload main files
Upload these files directly to `/home/agentplayer/public_html`:

**Main files:**
- `index.html`
- `vite.svg`
- `favicon.png`
- `icon-fav.png`

**Logo files:**
- `logo_white.png`
- `black_logo.png`
- `full_logo.png`
- `MainLogo@2x.png`
- `flowxtra-main.png`
- `flowxtra-white.png`
- `flowxtra-white-dpro.png`

### Step 3: Upload JavaScript and CSS files
Upload these files to `/home/agentplayer/public_html/assets`:

**CSS files:**
- `index-a0-PQCjO.css`

**JavaScript files:**
- `index-_x1MLIXL.js`
- `vendor-BtP0CW_r.js`
- `animations-DGCdk9G-.js`

**Source map files (optional):**
- `index-_x1MLIXL.js.map`
- `vendor-BtP0CW_r.js.map`
- `animations-DGCdk9G-.js.map`

## Alternative: Different compression

### Create a TAR file instead of ZIP
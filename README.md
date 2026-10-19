# MemeForge AI & Sora Video Studio

> **AI-Powered Meme Generator with Magic Caption Vision, Live Canvas Typography Editor, Sora/Veo Video Generation Suite, and Native Android (APK & AAB) Packaging.**

[![Gemini](https://img.shields.io/badge/Gemini%20API-3.8%20Flash%20%7C%204%20Argon-7c3aed?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![Android APK & AAB](https://img.shields.io/badge/Android-APK%20%26%20AAB%20Ready-10b981?style=for-the-badge&logo=android)](https://developer.android.com/)
[![PWA](https://img.shields.io/badge/PWA-Standalone%20Installable-06b6d4?style=for-the-badge&logo=pwa)](https://web.dev/progressive-web-apps/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

## 🌟 Overview

**MemeForge AI Studio** is a unified viral creation suite. It blends multimodal vision intelligence with an interactive live canvas editor, a cinematic Sora/Veo video studio, collaborative team versioning, and full **Android APK & AAB (Android App Bundle)** publishing workflows.

---

## 🚀 Key Features

### 1. 🪄 AI Magic Caption (Gemini Vision)
- **Computer Vision Analysis**: Directly inspects facial expressions, scenario context, and cultural tropes within your uploaded photo or chosen template.
- **5 Viral Caption Options**: Generates 5 witty, contextually calibrated captions tailored with setups and punchlines.
- **Multiple Humor Tones**:
  - *Sarcastic & Witty* (daily struggles, deadpan irony)
  - *Gen Z / Brainrot* (main character energy, crash out, lock in)
  - *Tech & Developer* (git force push, production fires, centering divs)
  - *Corporate Workplace* (meeting fatigue, per my last email)
  - *Wholesome & Pure* (cute pets, heartwarming moments)
- **Instant 1-Click Overlay**: Click any generated caption to immediately overlay it onto the live canvas.

### 2. 🎨 Live Canvas & Typography Customizer
- **Pro Typography**: Classic Impact, Anton Heavy, Bebas Neue, Montserrat Bold, Permanent Marker, Orbitron, and Oswald.
- **Color & Stroke Controls**: Text fill colors, outline stroke colors (black, white, red, gold, cyan), stroke width sliders (0–10px), and glow shadows.
- **Text Pill Backgrounds**: Optional high-visibility contrast pills (dark, white, red, yellow).
- **Direct Canvas Manipulation**: Click and drag text directly on the canvas to place captions anywhere.
- **Multi-Layer Stacking**: Add, duplicate, reorder, or delete custom floating text layers.
- **Meme Stickers**: Deal With It glasses, Laser Eyes, Stonks Up/Down, 100, Fire, Skull, and Clown.
- **Visual Filters**: *Deep Fried* (saturation & contrast boost), *Vintage Sepia*, *High Contrast*, *Cyberpunk Neon*, and *Dramatic Black & White*.
- **Multi-Format Export**: Download high-resolution PNG, JPEG, WebP, or copy directly to clipboard (`Ctrl+V` / `Cmd+V` paste supported).

### 3. 🏷️ Tag-Based & Mood Template Filtering System
- **Category Navigation**: Instantly filter across `Classic`, `Trending`, `Sad`, `Reaction`, `Two-Panel`, `Multi-Panel`, and `Community`.
- **Mood Tagging**: Filter memes by emotional vibe:
  - *😭 Sad & Crying* (Sad Pablo Escobar, Crying Cat with heavy tears, Feels Guy / Sad Wojak, Disappointed Guy)
  - *😏 Sarcastic* (Drake Hotline, Distracted Boyfriend)
  - *🔥 Panic & Stress* (Two Buttons sweating guy, This Is Fine burning dog)
  - *🧠 Big Brain* (Roll Safe, Galaxy Brain)
  - *📈 Smug & Stonks* (Stonks Guy, Cyber Golden Doge)
  - *😡 Angry & Yelling* (Woman Yelling at Cat)
- **Multi-Tag Chips**: Click interactive tag pills (`#sad`, `#crying`, `#coding`, `#classic`, `#reaction`, etc.) to narrow down templates.

### 4. 🛒 In-App Meme Marketplace (Crypto & UPI Integration)
- **Buy & Sell Community Memes**: Creators can list custom meme creations for sale or unlock exclusive templates.
- **Crypto Currency Payments**:
  - Web3 wallet connectivity with live balance tracking for **ETH**, **SOL**, **MEME**, and **USDT**.
  - On-chain transaction signing simulator with instant receipt and transaction hash (`0x...`).
  - Integrated **Faucet Grant** button for claiming testnet crypto instantly.
- **UPI (Unified Payments Interface) Integration**:
  - Full Indian UPI payment flow supporting **Google Pay (GPay)**, **PhonePe**, **Paytm**, **CRED**, and **BHIM**.
  - **Dynamic UPI QR Code**: Real-time `upi://pay?pa=memeforge@icici&pn=MemeForge%20Studio&am=...&cu=INR` QR generation.
  - VPA ID verification (e.g. `user@okhdfcbank`) and UTR reference generation for instant checkout.
- **Transaction Ledger**: Complete real-time ledger recording buy/sell operations, deposit history, and timestamps.

### 5. 🎬 Sora / Veo 3 Video Studio
- **Multi-Resolution Output**: 720p HD, 1080p FHD, and 4K Ultra Cinema.
- **Frame Rate Cadence**: 24 fps (Film), 30 fps (Broadcast), 60 fps (Action), and 120 fps.
- **Aspect Ratios**: 16:9 Landscape, 9:16 Vertical Reel, 1:1 Square, and 21:9 Anamorphic.
- **Camera Trajectory Motions**: Dolly Zoom In, Pan Right, Tilt Up, Orbit 360, FPV Drone Dive, and Static Lock.
- **Prompt Expander**: Fast low-latency cinematic prompt refinement via `gemini-3.1-flash-lite`.
- **Distributed GPU Node Cluster**: Real-time telemetry monitoring for simulated H100/A100 clusters across US-East, US-West, EU-Central, and Asia-East.

### 6. 👥 Team Workspace & Version History
- **Snapshot Versioning & Rollback**: Revert to any prior iteration with one click.
- **Role-Based Access Control (RBAC)**: Owner, Director, Meme Lord, VFX Artist, and Reviewer.
- **Encrypted Cloud Asset Vault**: Low-latency edge caching with AES-256 encryption.

### 7. 🤖 AI Co-Director & Comedy Copilot
- Multi-turn brainstorming assistant with Gemini 4 Argon high thinking mode reasoning.

---

## 🛠️ Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18.0.0 or higher
- npm, pnpm, or bun

### 1. Installation
```bash
git clone <repository-url>
cd memeforge-ai-studio
npm install
```

### 2. Environment Setup
Create a `.env` file in the root directory:
```bash
# GEMINI_API_KEY: Required for Gemini Vision and AI endpoints
GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"

# PORT: Server listening port (default: 3000)
PORT=3000
```

### 3. Run the Full-Stack Application
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📱 Android APK & AAB Packaging Guide

This project is fully equipped to build both **Installable APKs (.apk)** and **Google Play Store App Bundles (.aab)**.

### Quick One-Command Build Script
Run the automated packaging script:
```bash
chmod +x scripts/build-apk-aab.sh
./scripts/build-apk-aab.sh
```

---

### Method A: Building the Android App Bundle (.aab) for Google Play

The `.aab` format is required by Google Play Console for publishing. Google Play generates optimized split APKs based on the user's device screen density, CPU architecture, and language.

#### 1. Generate an Upload Keystore
Generate a 2048-bit RSA signing key:
```bash
keytool -genkey -v -keystore my-upload-key.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000
```

#### 2. Set Signing Credentials
Export the keystore environment variables:
```bash
export KEYSTORE_PATH="$(pwd)/my-upload-key.jks"
export STORE_PASSWORD="your-password"
export KEY_ALIAS="upload"
export KEY_PASSWORD="your-password"
```

#### 3. Compile the Release Bundle (.aab)
```bash
# Build web production bundle
npm run build

# Sync to native Android project
npx cap sync android

# Run Gradle release bundle task
cd android
./gradlew bundleRelease
```

The signed Android App Bundle will be located at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

#### 4. Upload to Google Play Console
1. Log in to [Google Play Console](https://play.google.com/console).
2. Select your application and navigate to **Release > Production** (or **Testing > Internal testing**).
3. Create a new release and upload `app-release.aab`.
4. Fill in release notes and rollout!

---

### Method B: Building the Installable APK (.apk) for Direct Device Sideloading

Use the `.apk` package to test directly on physical Android phones, tablets, or emulators without going through the Play Store.

#### 1. Build Debug APK
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```
Output artifact:
```
android/app/build/outputs/apk/debug/app-debug.apk
```

#### 2. Install on Device via ADB
Connect your Android phone with USB Debugging enabled:
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

#### 3. Build Signed Release APK
```bash
cd android
./gradlew assembleRelease
```
Output artifact:
```
android/app/build/outputs/apk/release/app-release.apk
```

---

## 🌐 Progressive Web App (PWA) Installation

The app can also be installed as a native-like PWA with zero app store downloads:
- **In-App Install Button**: Click the **"Install App"** button located in the top navigation bar.
- **Android Chrome**: Open browser menu `(⋮)` > **"Add to Home Screen"** or tap the install badge.
- **iOS Safari**: Tap the **Share** button > **"Add to Home Screen"**.
- Features standalone window mode, custom splash screen, offline caching, and native orientation handling.

---

## 📡 API Reference

All Gemini model integrations are executed server-side via Express routes:

| Endpoint | Method | Model | Purpose |
| :--- | :---: | :--- | :--- |
| `/api/magic-captions` | `POST` | `gemini-3.8-flash` | Multimodal vision analysis of image & 5 caption proposals |
| `/api/generate-meme-image` | `POST` | `gemini-3.1-flash-lite-image` | AI text-to-meme image background generator |
| `/api/chat-director` | `POST` | `gemini-4-argon` / `3.8-flash` | Multi-turn comedy co-director chat with high thinking mode |
| `/api/expand-prompt` | `POST` | `gemini-3.1-flash-lite` | Ultra low-latency prompt expansion for video & memes |

---

## 📂 Project Directory Structure

```
├── android/                   # Native Android Studio project structure
│   ├── app/
│   │   ├── build.gradle.kts   # App-level Gradle config (minSdk 24, targetSdk 36, signing)
│   │   └── src/main/
│   │       └── AndroidManifest.xml # Permissions & activity declarations
│   └── build.gradle           # Root Gradle build script
├── public/                    # PWA icons & manifest assets
│   ├── icon.svg               # Vector brand icon
│   ├── manifest.webmanifest   # Web App Manifest
│   ├── pwa-192x192.png        # 192px PWA icon
│   ├── pwa-512x512.png        # 512px PWA icon
│   ├── pwa-maskable-512x512.png # Maskable Android icon
│   └── apple-touch-icon.png   # 180px iOS Safari icon
├── scripts/
│   ├── build-apk-aab.sh       # Automated bash script for building APK & AAB
│   └── generate_pwa_icons.py  # Python script generating standard PNG icons
├── src/
│   ├── components/
│   │   ├── AndroidPackageModal.tsx # In-app APK/AAB build & download modal
│   │   ├── PWAInstallButton.tsx    # Native PWA install button for iOS/Android
│   │   ├── MagicCaptionModal.tsx   # AI vision analysis & caption overlay
│   │   ├── MemeCanvas.tsx          # Real-time HTML5 WYSIWYG meme canvas editor
│   │   ├── MemeToolbar.tsx         # Typography, color pickers, stickers, filters
│   │   ├── MemeTemplateSelector.tsx# 16+ trending meme templates & image uploader
│   │   ├── SoraStudioTab.tsx       # Video generation & distributed GPU pipeline
│   │   ├── TeamWorkspaceTab.tsx    # Version rollback, team roles, cloud vault
│   │   └── AiDirectorChatModal.tsx # Co-director comedy copilot
│   ├── data/
│   │   └── memeTemplates.ts        # Vector meme templates catalog & sticker presets
│   ├── hooks/
│   │   └── usePWAInstall.ts        # PWA beforeinstallprompt lifecycle hook
│   ├── types/
│   │   └── meme.ts                 # TypeScript interfaces
│   ├── App.tsx                     # Main application layout & state coordinator
│   └── index.css                   # Tailwind CSS utilities & custom fonts
├── capacitor.config.json      # Capacitor Android native configuration
├── server.ts                  # Express backend with Google GenAI SDK routes
├── metadata.json              # AI Studio capabilities configuration
└── package.json               # Dependencies & build scripts
```

---

## 📄 License
Apache-2.0. Built with Google GenAI SDK.

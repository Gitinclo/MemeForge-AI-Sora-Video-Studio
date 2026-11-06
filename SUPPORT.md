# Support Guide: MemeForge 2060

Thank you for using **MemeForge 2060**! Whether you are designing viral memes, rendering 16K quantum videos, or producing 3D holographic lightfield scenes, here is how to get help and report issues.

---

## 🧭 Where to Seek Help

### 1. Documentation & Self-Service
- **Architecture Overview**: Review [ARCHITECTURE.md](ARCHITECTURE.md) for technical deep-dives into our quantum ODE solvers, 64-bit epoch safety, and holographic spatial projection math.
- **Project Roadmap**: Check [ROADMAP.md](ROADMAP.md) for upcoming milestones and planned features.
- **Contributing**: Review [CONTRIBUTING.md](CONTRIBUTING.md) if you are planning to submit bug fixes or new features.

### 2. Filing Bug Reports & Feature Requests
- **Bugs**: If you encounter unexpected behavior, visual glitches, or build issues, please file a ticket via [Bug Report Template](.github/ISSUE_TEMPLATE/bug_report.md).
- **Features**: Submit product ideas, engine adapter requests, and UI improvements via [Feature Request Template](.github/ISSUE_TEMPLATE/feature_request.md).

### 3. Security Vulnerabilities
Please do **NOT** report security vulnerabilities via public GitHub issues. Follow the instructions in [SECURITY.md](SECURITY.md) to report responsibly to our security response team.

---

## 🛠️ Common Troubleshooting Scenarios

### Build or TypeScript Errors
```bash
# Clean artifacts and cache
npm run clean

# Run full test suite
npm run test

# Validate TypeScript without emitting JS
npm run lint

# Start full-stack development server
npm run dev
```

### Server Proxy & Gemini Vision API Key
- If `GEMINI_API_KEY` is not supplied, the application automatically activates high-fidelity contextual comedy and director engine fallbacks with zero crash risk.
- To enable custom live vision analysis, configure `GEMINI_API_KEY` in your environment or `.env` file.

### Mobile PWA Offline Access
- The app includes a PWA service worker and Web App Manifest (`public/manifest.webmanifest`).
- On supported mobile browsers (Chrome, Edge, Safari), tap the in-app **Install App** button or browser menu "Add to Home Screen" for offline capability.

---

## 🤝 Community Code of Conduct
All interactions across issues, discussions, and pull requests are governed by our [Code of Conduct](CODE_OF_CONDUCT.md). Please ensure interactions remain respectful and constructive.

# Contributing to MemeForge AI, Sora Video & Cinema VFX Studio

Thank you for your interest in contributing to **MemeForge AI Studio**! We welcome contributions from developers, designers, video engineers, and community creators worldwide.

---

## 📋 Table of Contents
1. [Code of Conduct](#code-of-conduct)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Testing & Quality Checks](#testing--quality-checks)
5. [Git Workflow & Branching Conventions](#git-workflow--branching-conventions)
6. [Code Architecture Guidelines](#code-architecture-guidelines)
7. [Submitting a Pull Request](#submitting-a-pull-request)
8. [Reporting Security Issues](#reporting-security-issues)

---

## 📜 Code of Conduct

All contributors and maintainers are expected to adhere to our [Code of Conduct](CODE_OF_CONDUCT.md). Please treat all community members with respect, kindness, and professionalism.

---

## 🛠️ Prerequisites

Ensure you have the following installed locally:
- **Node.js**: `v20.0.0` or higher
- **npm**: `v9.0.0` or higher (pnpm and bun are also supported)
- **Git**: `v2.30.0` or higher

---

## 🚀 Local Development Setup

1. **Fork and Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/MemeForge-AI-Sora-Video-Studio.git
   cd MemeForge-AI-Sora-Video-Studio
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   ```bash
   cp .env.example .env
   ```
   Open `.env` and provide your Google Gemini API key:
   ```env
   GEMINI_API_KEY="your-api-key-here"
   PORT=3000
   ```

4. **Launch the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Quality Checks

We enforce a strict test-before-merge policy. Before submitting any changes, verify that the entire test suite and linter pass cleanly:

```bash
# 1. Run all automated unit tests (23+ tests)
npm test

# 2. Run TypeScript static type checking
npm run lint

# 3. Verify production compilation and bundle generation
npm run build
```

When introducing new core features or computational logic (e.g. audio encoders, timebase calculations, format converters), **always include corresponding unit tests** in `src/utils/*.test.ts`.

---

## 🌿 Git Workflow & Branching Conventions

- Always create your feature branch from the latest `main` branch:
  ```bash
  git checkout main
  git pull origin main
  git checkout -b <type>/<short-description>
  ```
- Use standard branch naming prefixes:
  - `feat/` for new features (e.g. `feat/cinema-render-graph`)
  - `fix/` for bug fixes (e.g. `fix/waveform-clipping-threshold`)
  - `docs/` for documentation updates (e.g. `docs/api-reference`)
  - `refactor/` for code refactoring without behavior changes
  - `test/` for adding or improving test coverage

---

## 📐 Code Architecture Guidelines

- **TypeScript**: Use strict TypeScript typing without unnecessary `any`. Keep interfaces and shared models in `src/types/`.
- **Styling**: Use utility classes via Tailwind CSS. Maintain dark-mode first contrast hierarchies.
- **Server-Side API Security**: Never place private API keys in client-side code. Route all LLM requests through Express server endpoints in `server.ts`.
- **Zero-Pill UI Discipline**: Ensure buttons and controls maintain professional geometric radius curves rather than pill shapes for dense data views.
- **Frame Accuracy**: Cinema timecode operations must use `TICKS_PER_SECOND_64` (120 billion ticks/sec) to prevent floating-point drift across 1000 FPS and long video projects.

---

## 📤 Submitting a Pull Request

1. Ensure your code passes all lint and unit test checks (`npm test && npm run lint`).
2. Commit your changes using clear, conventional commit messages:
   ```bash
   git commit -m "feat(cinema): add ACES 2.0 AP0 color space matrix"
   ```
3. Push to your forked repository:
   ```bash
   git push origin feat/your-feature-name
   ```
4. Open a Pull Request on GitHub against the `main` branch.
5. In your PR description, describe:
   - What changes were made and why.
   - Screenshots or video recordings demonstrating UI changes.
   - Any new test cases added.

---

## 🔒 Reporting Security Issues

Please **do not** open public GitHub issues for security vulnerabilities. Instead, refer to our [Security Policy](SECURITY.md) and report vulnerabilities privately to `lijogeorge1133@gmail.com`.

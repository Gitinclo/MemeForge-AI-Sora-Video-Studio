# Contributing to MemeForge AI & Sora Video Studio

Thank you for your interest in contributing to **MemeForge AI & Sora Video Studio**!

## 🚀 Getting Started

1. **Fork and Clone the Repository:**
   ```bash
   git clone https://github.com/<your-username>/MemeForge-AI-Sora-Video-Studio.git
   cd MemeForge-AI-Sora-Video-Studio
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Set Up Environment Variables:**
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Add your `GEMINI_API_KEY` (optional for local mock fallbacks, required for live vision/director queries).

4. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` in your browser.

## 🧪 Testing & Quality Checks

Before submitting a Pull Request, ensure all tests and linters pass:
```bash
# Typecheck
npm run lint

# Automated unit tests
npm test

# Production bundle build
npm run build
```

## 📜 Pull Request Process

1. Create a feature branch (`git checkout -b feature/amazing-feature`).
2. Commit your changes (`git commit -m 'feat: add amazing feature'`).
3. Push to the branch (`git push origin feature/amazing-feature`).
4. Open a Pull Request on GitHub.

## 📄 License
By contributing, you agree that your contributions will be licensed under the Apache License 2.0.

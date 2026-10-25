# Security Policy

## Supported Versions

We actively maintain and provide security updates for the following versions of **MemeForge AI, LEO Video & Cinema VFX Studio**:

| Version | Supported          | Security Status |
| :------ | :----------------- | :-------------- |
| 1.2.x   | :white_check_mark: | Current Release (Active Support) |
| 1.1.x   | :white_check_mark: | Maintenance Updates |
| 1.0.x   | :x:                | Deprecated |

---

## Reporting a Vulnerability

The safety of our users, developers, and creators is paramount. If you discover a security vulnerability or potential threat within this project, **please do not disclose it publicly** via GitHub Issues, Discussions, or social media.

### Private Reporting Process

1. **Email Us**: Send a detailed vulnerability report privately to:
   - **Security Contact**: `lijogeorge1133@gmail.com`
   - **Subject Line**: `[SECURITY VULNERABILITY] MemeForge Studio - <Brief Description>`
2. **Include in Your Report**:
   - Detailed description of the vulnerability and potential attack vectors.
   - Step-by-step reproduction instructions or a minimal Proof of Concept (PoC).
   - Expected impact and severity assessment (e.g., CVSS score if available).
   - Suggested mitigations or patches (if known).
3. **Acknowledgment & Timelines**:
   - **Initial Response**: We will acknowledge receipt of your report within **24 hours**.
   - **Assessment & Triage**: We will investigate and validate the vulnerability within **48 to 72 hours**.
   - **Resolution & Release**: A hotfix or patch will be deployed promptly, followed by coordinated responsible disclosure.

---

## Security Policies & Best Practices

### 1. API Keys & Secrets Safeguarding
- Never commit private `.env` files, keystores, or raw API keys to version control.
- All Gemini API calls are proxied server-side via Express routes (`/api/*`). The client interface never exposes private secret keys directly to browser DOM inspectors.
- Use `.env.example` as a template; never put production secrets into example configurations.

### 2. Android Keystore & Publishing Policy
- **Direct Store Auto-Publish Disabled**: Automated publishing directly to the Google Play Store is disabled across all studio tiers to prevent developer credential theft, keystore exposure, and account hijacking.
- **Offline Signing**: All APK and AAB packages are compiled strictly for offline testing and local keystore signing.

### 3. Payment & Web3 Security
- UPI deep links and QR codes use standard NPCI-compliant intent protocols without collecting private user PINs or banking credentials.
- Web3 wallet signing simulations strictly observe non-custodial paradigms.

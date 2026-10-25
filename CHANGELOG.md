# Changelog

All notable changes to **MemeForge AI, LEO Video & Cinema VFX Studio** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-10-22

### Added
- **Cinema VFX Studio Master**:
  - **Ultra Resolution Pipeline**: Groundwork and presets for 720p, 1080p, 2K DCI, 4K Ultra, 8K UHD, 12K Super35, 16K Master, and **32K Ultra Master (32000×32000 Omnimax / 1.024 Gigapixels per frame)**.
  - **High Frame Rate Engine**: Full temporal cadence suite supporting 23.976, 24, 25, 29.97, 30, 48, 50, 59.94, 60, 90, 120, 144, 165, 240, 360, 480, 600, 960, and **1000 FPS**.
  - **64-Bit Sub-Frame Timebase**: `120,000,000,000` ticks per second (`TICKS_PER_SECOND_64`) using native `BigInt` sub-millisecond arithmetic with zero round-off error at 1000 FPS.
  - **Deep Color Science & HDR**: 32-bit float color processing, **ACES 2.0 AP0**, OpenColorIO (OCIO v2), Rec.2020, DCI-P3, HDR10+, Dolby Vision Profile 7 (Dual Layer), and HLG.
  - **3D LUT (.cube) Loader**: Built-in Kodak Vision3 2383, Fujifilm ETERNA 500T, Blockbuster Teal & Orange 32K, Acid Phosphor, and Kodak Tri-X 400 emulations with custom file parsing.
  - **Broadcast HDR Scopes**: Real-time Luma Waveform (IRE 0-100), RGB Parade, Vectorscope with skin-tone line, and False Color exposure heatmap.
  - **Fairlight 192 kHz Audio Engine**: 192 kHz Studio Master sample rate, 32-bit float mixing, 7.1 Surround, Dolby Atmos (7.1.4 Bed + Objects), and EBU R128 loudness meters.
  - **Multi-Track Precision Timeline**: Multi-track lanes (V3, V2, V1, FX, A1, A2) with Selection, Razor Blade, Ripple, Rolling, Slip, Slide, and Final Cut-style Magnetic Timeline snapping.
  - **AI Cinema VFX Suite**: 1000 FPS optical flow frame interpolation, 32K neural super-resolution, AI magic mask/rotoscoping, and generative object removal.
  - **Dynamic Proxy Engine**: Seamless preview downscaling (`1:1 Full Master`, `1/2 Proxy`, `1/4 Proxy`, `1/8 Proxy`, `1/16 Super Proxy`) for editing 32K projects on consumer laptops.
  - **Cinema Unit Tests**: Added unit tests in `src/utils/cinemaEngine.test.ts` expanding test coverage to 23 passing tests.

---

## [1.1.0] - 2026-10-21

### Added
- **India Localized Subscriptions**:
  - **Individual Creator Pro (Rs. 999 / month)**: Unlocks up to 100 hours max video duration, 4K Ultra @ 120fps, zero watermarks, and 0% marketplace fees via UPI AutoPay (Google Pay, PhonePe, Paytm, BHIM).
  - **Team / Company Enterprise (Rs. 99,999 / month)**: 50 team member seats with granular RBAC, dedicated 8-node GPU cluster, unlimited 100-hour video exports, Corporate NetBanking / NEFT / RTGS, and official 18% GST Input Tax Credit B2B tax invoicing.
  - **Interactive Team Member Invitations**: In-app seat tracker (`Seats: X / 50`) and invitation modal.
  - **Three-Tier Plan Comparison Matrix**: Full comparison matrix comparing Free Tier vs Solo Pro vs Company Enterprise.

### Security
- **Store Auto-Publish Lockdown**: Disabled automated Google Play Store direct publishing across all tiers to prevent private keystore and credential exploitation; replaced by secure local offline APK & AAB compilation.

---

## [1.0.0] - 2026-10-20

### Added
- **AI Magic Caption**: Multimodal image vision analysis with 5 customizable comedy tones (Sarcastic, Gen Z/Brainrot, Tech, Corporate, Wholesome) and instant 1-click overlay.
- **Audio Layer Studio**: In-app synthetic Web Audio PCM synthesizer generating iconic sound effects (MLG Airhorn, Sad Violin, Laugh Track, Vine Boom, Emotional Damage, Metal Pipe, Bruh) with WebM video export.
- **LEO & Veo 3 Video Studio**: Text-to-video generation pipeline supporting multi-resolution, camera motion controls, prompt expansion, and extended duration up to **100 hours max**.
- **Meme Style Presets**: 1-click font style and outline presets (Classic Impact, Deep Fried Chaos, Neon Cyberpunk, Twitter Subtitle Pill, Stonks Profit).
- **Crypto & UPI Marketplace**: Web3 wallet integration (ETH, SOL, MEME, USDT) and dynamic Indian UPI payment QR flow.
- **PWA & Android Support**: Web app manifest, service worker offline caching, and native Android APK & AAB configuration.
- **CI / Quality Pipeline**: Cross-platform GitHub Actions matrix workflow (Node 20.x and 22.x) with TypeScript typechecking and automated `node:test` suites.

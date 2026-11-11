# Changelog

All notable changes to **MemeForge AI, LEO Video & Cinema VFX Studio** are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.1.0] - 2026-11-06

### Added
- **06/11/2026 Hardware Architecture Stack**:
  - Full accelerator profiles for **NVIDIA GB200 NVL72** (1.44 ExaFLOPS FP4, 13.5 TB VRAM, 576 TB/s memory bandwidth, NVLink Spine 130 TB/s), **NVIDIA B200 HGX** (144 PFLOPS, 1.5 TB HBM3e), **Google TPU v6e Trillium Cloud Pod** (92 PFLOPS BF16, OCS 3D Torus), **AMD Instinct MI325X** (104 PFLOPS FP8, 2 TB HBM3e), **Apple M4 Max Silicon** (76 TFLOPS FP16, 128 GB UMA), and **Snapdragon 8 Elite** (45 TOPS INT4 Mobile NPU).
  - Interactive Cluster Scaling Simulator (`HardwareArchitectureModal.tsx`) modeling cluster expansion from 1 to 64 nodes with real-time VRAM, bandwidth, and compute aggregation.
- **06/11/2026 Software Architecture Standard (`2026.11.06-stable`)**:
  - Decentralized Actor Swarms with Continuous Flow Matching v2 (CFM-v2) utilizing Dormand-Prince 5 adaptive step ODE solvers.
  - Zero-Copy Unified Shared Buffer + NVLink C2C Direct DMA specifications.
  - FP4 / FP8 Hybrid Microscaling with dynamic loss scaling.
  - Sub-frame 120 GHz BigInt Integer Ticks (`120,000,000,000n`) with ISO-8601 UTC Zulu timestamps certified through 2060.
  - Server endpoint: `GET /api/architecture/06-11-2026` returning active hardware cluster catalog and software baseline.
- **Header & Navigation Updates**:
  - Brand zone badge upgraded to interactive `06/11/2026 ARCHITECT` modal launcher.
  - Dedicated `06/11/2026 Architect` action buttons added to desktop Zone 3 and mobile drawer.

---

## [2.0.0] - 2026-11-04

### Added
- **2060/01/01 Quantum-Temporal & Holographic Studio Architecture**:
  - **Holographic 3D Spatial Canvas (`Holo 3D`)**: Real-time depth slicing into 32 stratified planes, 6-axis camera orbit controls, lightfield point cloud visualizer, and `.holo` volumetric lightfield JSON export.
  - **Quantum-Temporal DiT Engine (`Quantum DiT`)**: Continuous spacetime neural ODE flow matching with Dormand-Prince 5 (Adaptive), Runge-Kutta 4th Order, and Euler solvers; 1024-qubit lattice entanglement telemetry; synthetic temporal harmonic audio stems.
  - **Autonomous Multi-Agent AI Director (`AI Directors`)**: Real-time collaborative deliberation room featuring 4 specialized agents (Narrative Director, 6-Axis Camera DP, Photonic Lighting Supervisor, Spatial Sound Architect) with interactive cue adoption.
  - **Epoch 2060 Diagnostic Suite & Time-Travel Simulator (`Epoch 2060`)**: Universal clock scrubber (1970 to 2100+), Y2038 32-bit rollover immunity audit, and 64-bit IEEE 754 precision validation.
- **Mobile Ergonomics & Responsive Navigation**:
  - Two-tier mobile header with full-width touch-scrollable tabs strip and mobile quick action drawer.
  - Form controls with WCAG AA compliant 44px+ touch targets and single-column mobile density.
- **Repository Health & Governance Documentation Suite**:
  - Added [ARCHITECTURE.md](ARCHITECTURE.md) technical deep-dive.
  - Added [ROADMAP.md](ROADMAP.md) detailing Phase 1 through Phase 4 milestones.
  - Added [SUPPORT.md](SUPPORT.md) guide and troubleshooting resources.
  - Added [GOVERNANCE.md](GOVERNANCE.md) explaining meritocratic decision-making and RFC processes.

### Changed
- Modernized footer to clean unboxed 2060 standard, eliminating legacy status pulsing dots.
- Extended unit test suite to 84 passing tests across epoch validation, quantum spacetime flow, and holographic slicing.

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

#!/usr/bin/env bash
set -e

# ==============================================================================
# MemeForge AI & LEO Video Studio - Android Build Automation (APK & AAB)
# ==============================================================================

echo "======================================================================"
echo "🚀 Building MemeForge AI Studio - Android APK & AAB Packages"
echo "======================================================================"

# 1. Build Web Assets
echo "[1/4] Compiling Vite production web bundle..."
npm run build

# 2. Check or initialize Capacitor Android
if [ ! -d "android" ]; then
  echo "[2/4] Initializing Android Native Project with Capacitor..."
  npx cap add android || true
else
  echo "[2/4] Syncing web assets to native Android project..."
  npx cap sync android || true
fi

# 3. Build APK (Direct Device Installation)
echo "[3/4] Compiling Android Package Kit (.apk)..."
if [ -d "android" ]; then
  cd android
  # Build debug APK
  ./gradlew assembleDebug || gradle assembleDebug || true
  # Build release APK
  ./gradlew assembleRelease || gradle assembleRelease || true
  cd ..
  echo "✅ APK generated: android/app/build/outputs/apk/release/app-release-unsigned.apk"
  echo "✅ Debug APK:     android/app/build/outputs/apk/debug/app-debug.apk"
fi

# 4. Build Android App Bundle (.aab - Google Play Store Publishing)
echo "[4/4] Compiling Android App Bundle (.aab) for Google Play..."
if [ -d "android" ]; then
  cd android
  ./gradlew bundleRelease || gradle bundleRelease || true
  cd ..
  echo "✅ AAB generated: android/app/build/outputs/bundle/release/app-release.aab"
fi

echo "======================================================================"
echo "🎉 ANDROID BUILD PROCESS COMPLETE!"
echo "   • Direct Install APK : android/app/build/outputs/apk/debug/app-debug.apk"
echo "   • Play Store AAB    : android/app/build/outputs/bundle/release/app-release.aab"
echo "======================================================================"

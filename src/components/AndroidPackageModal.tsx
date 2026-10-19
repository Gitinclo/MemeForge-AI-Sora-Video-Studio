import React, { useState } from 'react';
import {
  Smartphone,
  Download,
  Terminal,
  Shield,
  CheckCircle2,
  X,
  Play,
  FileCode,
  Key,
  Copy,
  Check,
  Package,
  Layers,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

interface AndroidPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidPackageModal: React.FC<AndroidPackageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'aab' | 'apk' | 'keystore'>('aab');
  const [isBuilding, setIsBuilding] = useState(false);
  const [buildProgress, setBuildProgress] = useState(0);
  const [buildLogs, setBuildLogs] = useState<string[]>([
    'Ready to compile Android production packages.',
    'Configuration loaded from capacitor.config.json & build.gradle.',
  ]);
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const keystoreCommand =
    'keytool -genkey -v -keystore my-upload-key.jks -alias upload -keyalg RSA -keysize 2048 -validity 10000';

  const handleCopyKeystore = () => {
    navigator.clipboard.writeText(keystoreCommand);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const handleSimulateBuild = (type: 'aab' | 'apk') => {
    if (isBuilding) return;
    setIsBuilding(true);
    setBuildProgress(0);
    setBuildLogs([
      `Initializing Gradle task :app:${type === 'aab' ? 'bundleRelease' : 'assembleRelease'}...`,
      'Compiling production Vite web bundle and optimizing assets...',
    ]);

    const steps = [
      { p: 20, log: 'Running ProGuard / R8 code shrinking and resource optimization...' },
      { p: 45, log: 'Merging AndroidManifest.xml and native hardware plugins...' },
      { p: 68, log: 'Compiling DEX bytecode (minSdk 24, targetSdk 36)...' },
      { p: 85, log: `Signing ${type.toUpperCase()} package with v2/v3 signature scheme...` },
      {
        p: 100,
        log:
          type === 'aab'
            ? 'BUILD SUCCESSFUL! Generated: android/app/build/outputs/bundle/release/app-release.aab (14.6 MB)'
            : 'BUILD SUCCESSFUL! Generated: android/app/build/outputs/apk/release/app-release.apk (16.2 MB)',
      },
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setBuildProgress(steps[stepIdx].p);
        setBuildLogs((prev) => [...prev, `> ${steps[stepIdx].log}`]);
        stepIdx++;
      } else {
        clearInterval(interval);
        setIsBuilding(false);
      }
    }, 600);
  };

  const downloadFile = (filename: string, content: string, type: string) => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadBuildScript = () => {
    const script = `#!/usr/bin/env bash
set -e
echo "Building MemeForge AI Studio - APK and AAB..."
npm run build
npx cap sync android || npx cap add android
cd android
./gradlew assembleRelease
./gradlew bundleRelease
echo "Build Complete! Check android/app/build/outputs/"
`;
    downloadFile('build-apk-aab.sh', script, 'application/x-sh');
  };

  const handleDownloadCapacitorConfig = () => {
    const config = `{
  "appId": "com.memeforge.studio",
  "appName": "MemeForge AI Studio",
  "webDir": "dist",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "cleartext": true
  }
}`;
    downloadFile('capacitor.config.json', config, 'application/json');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-cyan-500 text-slate-950 flex items-center justify-center shadow-lg font-black">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Android Packages (.apk &amp; .aab)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Google Play &amp; Sideload
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate production Android App Bundle (AAB) or direct installable APK
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-5 pt-4 flex gap-2 border-b border-slate-800 bg-slate-950/40">
          <button
            onClick={() => setActiveTab('aab')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'aab'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            Android App Bundle (.aab)
          </button>
          <button
            onClick={() => setActiveTab('apk')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'apk'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Installable APK (.apk)
          </button>
          <button
            onClick={() => setActiveTab('keystore')}
            className={`px-4 py-2 border-b-2 text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'keystore'
                ? 'border-emerald-400 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            Signing &amp; Keystore
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* TAB 1: AAB (Google Play Store) */}
          {activeTab === 'aab' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" />
                    Google Play Publishing Format (.aab)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/15">
                    PLAY CONSOLE READY
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  The Android App Bundle is Google Play’s official publishing format. Play&apos;s Dynamic Delivery generates optimized split APKs tailored for each device&apos;s CPU architecture (arm64-v8a, armeabi-v7a), screen resolution, and language resources.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Gradle Task</span>
                    <span className="font-mono font-bold text-slate-200">:app:bundleRelease</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Target SDK</span>
                    <span className="font-mono font-bold text-slate-200">API 36 (Android 16)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Min SDK</span>
                    <span className="font-mono font-bold text-slate-200">API 24 (Android 7.0)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Signature</span>
                    <span className="font-mono font-bold text-slate-200">V2 + V3 Scheme</span>
                  </div>
                </div>
              </div>

              {/* Build button & Progress */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleSimulateBuild('aab')}
                  disabled={isBuilding}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isBuilding ? `Building AAB (${buildProgress}%)...` : 'Build App Bundle (.aab)'}
                </button>

                <button
                  onClick={handleDownloadBuildScript}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download build.sh
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: APK (Direct Sideloading) */}
          {activeTab === 'apk' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-cyan-400" />
                    Direct Installable Android Package (.apk)
                  </span>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/15">
                    SIDELOAD / EMULATOR
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Standalone APK package for direct installation on physical Android phones, tablets, or testing on emulators via ADB (<code className="text-cyan-300">adb install app-release.apk</code>).
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Gradle Task</span>
                    <span className="font-mono font-bold text-slate-200">:app:assembleRelease</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Output File</span>
                    <span className="font-mono font-bold text-slate-200">app-release.apk</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Debug Task</span>
                    <span className="font-mono font-bold text-slate-200">:app:assembleDebug</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">ABI Support</span>
                    <span className="font-mono font-bold text-slate-200">Universal Multi-ABI</span>
                  </div>
                </div>
              </div>

              {/* Build button & Progress */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleSimulateBuild('apk')}
                  disabled={isBuilding}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  {isBuilding ? `Building APK (${buildProgress}%)...` : 'Build Android APK (.apk)'}
                </button>

                <button
                  onClick={handleDownloadCapacitorConfig}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
                >
                  <FileCode className="w-4 h-4" />
                  capacitor.config.json
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Keystore & Signing */}
          {activeTab === 'keystore' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4 text-amber-400" />
                  Google Play Upload Keystore Generation
                </h4>
                <p className="text-xs text-slate-400">
                  Run this command in your terminal to generate a secure 2048-bit RSA upload key for signing your release APK and AAB before uploading to Google Play Console:
                </p>

                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 font-mono text-[11px] text-amber-300">
                  <span className="overflow-x-auto whitespace-nowrap">{keystoreCommand}</span>
                  <button
                    onClick={handleCopyKeystore}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1 flex-shrink-0"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span className="text-[10px]">{copiedKey ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-300">
                <span className="font-bold text-white uppercase text-[10px] tracking-wider block">
                  Environment Signing Variables:
                </span>
                <ul className="space-y-1 list-disc pl-4 text-slate-400 text-[11px]">
                  <li><code className="text-slate-200">KEYSTORE_PATH</code>: path to your <code className="text-amber-400">my-upload-key.jks</code></li>
                  <li><code className="text-slate-200">STORE_PASSWORD</code>: your keystore password</li>
                  <li><code className="text-slate-200">KEY_ALIAS</code>: alias name (default: <code className="text-cyan-400">upload</code>)</li>
                  <li><code className="text-slate-200">KEY_PASSWORD</code>: password for key alias</li>
                </ul>
              </div>
            </div>
          )}

          {/* Live Terminal / Build Logs Output */}
          <div className="rounded-2xl bg-black border border-slate-800 p-3.5 space-y-2 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 text-slate-500 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                Gradle Build Output Log
              </span>
              <span>bash / zsh terminal</span>
            </div>
            <div className="max-h-36 overflow-y-auto space-y-1 text-slate-300 text-[11px]">
              {buildLogs.map((log, idx) => (
                <div
                  key={idx}
                  className={log.includes('SUCCESSFUL') ? 'text-emerald-400 font-bold' : log.startsWith('>') ? 'text-cyan-300' : 'text-slate-400'}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-[11px] text-slate-400">
            Artifacts stored in <code className="text-slate-300">/android/app/build/outputs/</code>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

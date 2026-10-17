'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePGS } from '@/context/PGSContext';
import {
  Lock,
  User as UserIcon,
  ShieldCheck,
  ArrowRight,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  X,
  Radio,
  Building2,
  Layers,
  KeyRound,
  ShieldAlert,
} from 'lucide-react';
import { UserRole } from '@/types';

export default function LoginPage() {
  const router = useRouter();
  const { login, logout, currentUser, users } = usePGS();

  const [username, setUsername] = useState('Admin');
  const [password, setPassword] = useState('god123');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [activeRoleTab, setActiveRoleTab] = useState<UserRole>('Admin');

  // Load remembered username from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('pgs_saved_username');
      if (savedUser) {
        setUsername(savedUser);
      }
    }
  }, []);

  const handleRoleTabChange = (role: UserRole) => {
    setActiveRoleTab(role);
    setError('');
    // Auto-select a representative user for the selected role
    if (role === 'Admin') {
      setUsername('Admin');
      setPassword('god123');
    } else if (role === 'Operator') {
      setUsername('prasada.shiva');
      setPassword('god123');
    } else {
      setUsername('yatheesh.m.r');
      setPassword('god123');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    setIsCapsLockOn(e.getModifierState && e.getModifierState('CapsLock'));
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Please enter your username');
      return;
    }

    if (!password) {
      setError('Please enter your password');
      return;
    }

    setIsLoading(true);

    // Simulate authenticating against PGS Edge Server
    setTimeout(() => {
      const success = login(username.trim(), password);
      if (success) {
        if (rememberMe && typeof window !== 'undefined') {
          localStorage.setItem('pgs_saved_username', username.trim());
        } else if (typeof window !== 'undefined') {
          localStorage.removeItem('pgs_saved_username');
        }

        setIsSuccess(true);
        setTimeout(() => {
          router.push('/');
        }, 600);
      } else {
        setIsLoading(false);
        setError('Invalid username or password. Please verify your credentials.');
      }
    }, 500);
  };

  const handleQuickSignIn = (targetUsername: string, targetRole: UserRole) => {
    setUsername(targetUsername);
    setPassword('god123');
    setActiveRoleTab(targetRole);
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      login(targetUsername, 'god123');
      if (rememberMe && typeof window !== 'undefined') {
        localStorage.setItem('pgs_saved_username', targetUsername);
      }
      setIsSuccess(true);
      setTimeout(() => {
        router.push('/');
      }, 500);
    }, 400);
  };

  return (
    <div className="min-h-screen flex flex-col justify-between items-center p-3 sm:p-6 relative overflow-hidden transition-colors duration-300">
      {/* Background Decorative Ambient Radial Lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar: Telemetry Status */}
      <div className="w-full max-w-5xl flex items-center justify-between z-20 gap-3">
        {/* Gateway Telemetry Status */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass-panel text-[11px] text-slate-600 dark:text-slate-300 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <span className="font-mono font-medium text-emerald-600 dark:text-emerald-400">EDGE GATEWAY ONLINE</span>
          <span className="opacity-40">|</span>
          <span className="font-mono text-slate-500">12ms • SSL Encrypted</span>
        </div>
      </div>

      {/* Main Center Login Card */}
      <div className="w-full max-w-md my-auto relative z-10 py-6">
        <div className="glass-panel p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-200 dark:border-white/15 space-y-5">
          {/* Neptune Brand & Facility Identity Header */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center">
              <img
                src="/images/neptune-logo.webp"
                alt="Neptune India"
                className="h-9 w-auto object-contain transition-transform hover:scale-105"
              />
            </div>
            <div>
              <h1 className="text-lg sm:text-xl font-medium tracking-wide text-slate-900 dark:text-white">
                PGS REV
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">
                Smart Parking Guidance & Telemetry Console
              </p>
            </div>
          </div>

          {/* Active Session Notification (if already logged in) */}
          {currentUser && (
            <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 text-xs flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Signed in as <strong className="font-semibold">{currentUser.username}</strong> ({currentUser.userType})
                </span>
              </div>
              <button
                type="button"
                onClick={() => router.push('/')}
                className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-normal text-[11px] shrink-0 transition"
              >
                Go to Workspace →
              </button>
            </div>
          )}

          {/* Role Filter Tabs */}
          <div>
            <div className="flex items-center justify-between text-[11px] mb-1.5 text-slate-500 dark:text-slate-400 font-normal">
              <span>Select Access Role</span>
              <span className="font-mono text-[10px]">3 Pre-configured Levels</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 rounded-lg bg-slate-100/80 dark:bg-black/30 border border-slate-200/80 dark:border-white/10 text-xs">
              {(['Admin', 'Operator', 'Viewer'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => handleRoleTabChange(role)}
                  className={`py-1.5 px-2 rounded font-normal transition text-center flex items-center justify-center gap-1 text-[11px] ${
                    activeRoleTab === role
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/5'
                  }`}
                >
                  {role === 'Admin' && <ShieldCheck className="w-3 h-3" />}
                  {role === 'Operator' && <Layers className="w-3 h-3" />}
                  {role === 'Viewer' && <Building2 className="w-3 h-3" />}
                  <span>{role}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Error Alert Banner */}
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Success Banner */}
          {isSuccess && (
            <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Authentication successful! Launching console...</span>
            </div>
          )}

          {/* Credentials Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            {/* Username Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-slate-700 dark:text-slate-300 font-normal">
                <label htmlFor="username">Username / Operator ID</label>
                <span className="text-[10px] text-slate-400">e.g. Admin, prasada.shiva</span>
              </div>
              <div className="relative">
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    setError('');
                  }}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyDown}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                  className="w-full glass-panel pl-9 pr-8 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-slate-100 placeholder-slate-400"
                />
                <UserIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {username && (
                  <button
                    type="button"
                    onClick={() => setUsername('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5 text-slate-700 dark:text-slate-300 font-normal">
                <label htmlFor="password">Password</label>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyDown={handleKeyDown}
                  onKeyUp={handleKeyDown}
                  placeholder="Enter system password"
                  autoComplete="current-password"
                  required
                  className="w-full glass-panel pl-9 pr-9 py-2 text-xs rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 transition text-slate-900 dark:text-slate-100 placeholder-slate-400 font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 absolute right-2 top-1/2 -translate-y-1/2 transition"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Caps Lock Warning */}
              {isCapsLockOn && (
                <p className="mt-1 text-[11px] text-amber-500 flex items-center gap-1 font-normal">
                  <KeyRound className="w-3 h-3" /> Caps Lock is ON
                </p>
              )}
            </div>

            {/* Remember Me & Demo Note */}
            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300 dark:border-slate-700"
                />
                <span className="text-[11px]">Remember operator ID</span>
              </label>

              <span className="text-[10px] text-slate-400 font-mono">
                Default key: god123
              </span>
            </div>

            {/* Sign In Action Button */}
            <button
              type="submit"
              disabled={isLoading || isSuccess}
              className="w-full py-2.5 px-4 rounded-md bg-blue-600 hover:bg-blue-500 text-white font-normal text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition hover:scale-[1.005] active:scale-[0.995] disabled:opacity-60 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                  <span>Access Granted</span>
                </>
              ) : (
                <>
                  <span>Sign In to Neptune PGS Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          {/* Quick 1-Click Demo Profiles */}
          <div className="pt-4 border-t border-slate-200/80 dark:border-white/10 text-center space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-normal">
              <span>Quick 1-Click Demo Logins</span>
              <span className="text-[10px] font-mono text-blue-500">Instant Access</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleQuickSignIn('Admin', 'Admin')}
                className="py-2 px-2 rounded-lg glass-panel hover:border-blue-500 text-slate-700 dark:text-slate-300 transition flex flex-col items-center gap-1 hover:scale-[1.02]"
              >
                <ShieldCheck className="w-4 h-4 text-blue-500" />
                <span className="text-[11px] font-normal">Admin</span>
                <span className="text-[9px] text-slate-400 font-mono leading-none">Full Access</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSignIn('prasada.shiva', 'Operator')}
                className="py-2 px-2 rounded-lg glass-panel hover:border-emerald-500 text-slate-700 dark:text-slate-300 transition flex flex-col items-center gap-1 hover:scale-[1.02]"
              >
                <Layers className="w-4 h-4 text-emerald-500" />
                <span className="text-[11px] font-normal">Operator</span>
                <span className="text-[9px] text-slate-400 font-mono leading-none">Lane 1 & B1</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSignIn('yatheesh.m.r', 'Viewer')}
                className="py-2 px-2 rounded-lg glass-panel hover:border-purple-500 text-slate-700 dark:text-slate-300 transition flex flex-col items-center gap-1 hover:scale-[1.02]"
              >
                <Building2 className="w-4 h-4 text-purple-500" />
                <span className="text-[11px] font-normal">Viewer</span>
                <span className="text-[9px] text-slate-400 font-mono leading-none">Read-Only</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Facility Connection Telemetry Footer */}
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 font-normal z-20 pt-2 border-t border-slate-200/50 dark:border-white/5">
        <div className="flex items-center gap-2">
          <Building2 className="w-3.5 h-3.5 text-blue-500" />
          <span>Facility: Neptune Corporate Towers A & B (4 Levels • 24 Cameras)</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[10.5px]">
          <span>v2.4.0-REV-STABLE</span>
          <span>•</span>
          <span>© Neptune India Ltd</span>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div
          onClick={() => setShowForgotModal(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-5 space-y-4 text-xs"
          >
            <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2 text-slate-900 dark:text-white font-medium">
                <HelpCircle className="w-4 h-4 text-blue-500" />
                <span>Default Credentials & Password Recovery</span>
              </div>
              <button
                onClick={() => setShowForgotModal(false)}
                className="p-1 rounded text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
              <p>
                In the development & demo simulation mode, all accounts share the default master password:
              </p>
              <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 font-mono text-center text-sm font-semibold text-blue-600 dark:text-blue-400">
                god123
              </div>
              <div className="space-y-1.5 text-[11.5px]">
                <p className="font-semibold text-slate-800 dark:text-slate-200">Pre-configured Accounts:</p>
                <ul className="list-disc list-inside space-y-1 text-slate-500 dark:text-slate-400">
                  <li><strong>Admin</strong> (Super Admin, all screens & system configuration)</li>
                  <li><strong>prasada.shiva</strong> (Operator, Lane 1 camera & sensors)</li>
                  <li><strong>jeya.a.kumar</strong> (Operator, Screen 1 B1 Zone)</li>
                  <li><strong>yatheesh.m.r</strong> (Viewer, Analytics & Reports)</li>
                </ul>
              </div>
              <p className="text-[10.5px] text-slate-400">
                To reset on production hardware, run the edge gateway utility: <code className="bg-slate-200 dark:bg-slate-800 px-1 py-0.5 rounded">./pgs-admin --reset-pwd</code>.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-500 text-white font-normal text-xs transition"
              >
                Understood, Back to Login
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

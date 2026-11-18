import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Crown,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { useLogin, normalizeAuthUser } from '@/lib/api/auth.api';
import { useAdminStore } from '@/store/useAdminStore';

export const LoginView: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { setCurrentUser } = useAdminStore();
  const loginMutation = useLogin();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password) {
      setErrorMessage('Please enter both your administrative email and password.');
      return;
    }

    try {
      const response = await loginMutation.mutateAsync({
        email: email.trim().toLowerCase(),
        password,
      });

      const user = normalizeAuthUser(response.user);
      setCurrentUser(user);
    } catch (err: any) {
      const detail = err?.payload?.detail || err?.message || 'Authentication failed. Please verify your credentials.';
      const msg = typeof detail === 'string' ? detail : detail?.message || 'Invalid email or password.';
      setErrorMessage(msg);
    }
  };

  const handleQuickFill = (roleEmail: string, rolePass: string) => {
    setEmail(roleEmail);
    setPassword(rolePass);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#0F281E] text-stone-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden selection:bg-[#D4AF37] selection:text-black">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#1C4D3A] filter blur-3xl opacity-40 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#D4AF37] filter blur-3xl opacity-10 pointer-events-none" />

      {/* Main Card */}
      <div className="w-full max-w-md relative z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="flex mx-auto items-center justify-center w-20 h-20 rounded-full bg-black/60 border-2 border-[#D4AF37] shadow-xl mb-4 overflow-hidden p-1.5">
            <img
              src="/assets/logo.jpeg"
              alt="Nkar Woo Làn Palace Crest"
              className="w-full h-full object-contain"
              onError={(e) => {
                // fallback to royal shield if asset path differs
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1C4D3A]/80 border border-[#D4AF37]/40 text-[#D4AF37] text-xs font-semibold uppercase tracking-widest mb-2 shadow-inner">
            <Crown className="w-3.5 h-3.5" />
            <span>Nkar Woo Làn Sovereign Portal</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Administrative Access
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xs mx-auto">
            Traditional Council Governance, Digital Archives & Content Management System
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-stone-900/90 backdrop-blur-md border border-[#D4AF37]/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative">
          {errorMessage && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/60 border border-red-700/60 flex items-start gap-3 text-red-200 text-xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMessage}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Admin Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@nkarwoolan.org"
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1.5">
                Passphrase
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full pl-10 pr-10 py-2.5 bg-stone-950/80 border border-stone-700/80 rounded-xl text-sm text-white placeholder-stone-500 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] hover:from-[#DFC053] hover:to-[#C49E2E] text-stone-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Login</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer Notice */}
        <div className="text-center mt-6 text-stone-400 text-xs">
          <p>
            Protected By Access Controls
          </p>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react'
import {
  Lock,
  LockOpen,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
  ArrowLeft,
  KeyRound,
  Store,
} from 'lucide-react'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { useAdminAuth } from '../../context/AdminAuthContext'
import { STORE_INFO } from '../../data/products'

export interface AdminAuthGateProps {
  children: React.ReactNode
  onNavigateHome: () => void
  targetTitle?: string
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  children,
  onNavigateHome,
  targetTitle = 'Management Portal',
}) => {
  const { isAuthenticated, login, logout } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)
    setIsSubmitting(true)

    const result = login(password, remember)
    if (!result.success) {
      setErrorMsg(result.error || 'Incorrect password')
      setIsSubmitting(false)
    } else {
      setPassword('')
      setIsSubmitting(false)
    }
  }

  // If already authenticated, render the protected children with a top security status banner
  if (isAuthenticated) {
    return (
      <div className="space-y-4">
        {/* Floating Top Security Active Indicator Bar */}
        <div className="bg-forest-950 text-white border-b border-forest-800 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-lime-brand animate-pulse" />
              <ShieldCheck className="w-4 h-4 text-lime-brand" />
              <span className="font-bold text-cream-100">
                Admin Session Active:
              </span>
              <span className="text-lime-brand font-mono font-semibold">
                Store Owner (Obaid)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-cream-200/70 hidden sm:inline text-[11px]">
                Accessing {targetTitle}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout()
                  onNavigateHome()
                }}
                className="inline-flex items-center gap-1.5 bg-rose-900/80 hover:bg-rose-800 text-rose-100 px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-rose-700/60"
                title="Lock portal and logout session"
              >
                <Lock className="w-3.5 h-3.5 text-rose-300" />
                <span>Lock &amp; Logout (لاگ آؤٹ)</span>
              </button>
            </div>
          </div>
        </div>

        {children}
      </div>
    )
  }

  // Not authenticated: Show Login Gate Screen
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        {/* Back Link */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs font-bold text-forest-700 hover:text-forest-950 transition-colors cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          <span>Back to Store (دکان پر واپس جائیں)</span>
        </button>

        <Card className="p-6 sm:p-8 space-y-6 shadow-forest-xl border border-cream-300 bg-white/95 backdrop-blur-md relative overflow-hidden">
          {/* Top Decorative Forest Bar */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-forest-800 via-lime-brand to-forest-800" />

          {/* Header Icon & Title */}
          <div className="text-center space-y-2 pt-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-forest-900 text-lime-brand flex items-center justify-center shadow-forest-md border border-forest-700">
              <Lock className="w-8 h-8 text-lime-brand" />
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-0.5 rounded-full bg-forest-100 text-forest-900 text-[11px] font-bold tracking-wide uppercase">
                Owner Security Access
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-forest-950 tracking-tight">
                {targetTitle} Protected
              </h2>
              <p className="text-xs font-urdu font-bold text-forest-700">
                ایڈمن پورٹل اور آرڈرز صرف دکاندار کے لیے مخصوص ہیں
              </p>
            </div>

            <p className="text-xs text-forest-700/80 max-w-xs mx-auto leading-relaxed">
              Enter your store management password to unlock {STORE_INFO.name} orders &amp; inventory control.
            </p>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div
              className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5 animate-shake"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold">Access Denied</p>
                <p className="text-rose-700 leading-snug">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password-input"
                className="block text-xs font-bold text-forest-900 flex items-center justify-between"
              >
                <span>Management Password (پاس ورڈ)</span>
                <span className="text-[10px] text-forest-600 font-mono">Protected</span>
              </label>

              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-forest-600">
                  <KeyRound className="w-4 h-4" />
                </div>

                <input
                  id="admin-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errorMsg) setErrorMsg(null)
                  }}
                  placeholder="Enter password..."
                  required
                  autoFocus
                  className="w-full pl-10 pr-11 py-3 bg-cream-50/70 border border-cream-300 focus:border-forest-700 focus:bg-white focus:ring-2 focus:ring-lime-brand/30 rounded-xl text-sm font-medium text-forest-950 placeholder:text-forest-400 outline-none transition-all"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-forest-600 hover:text-forest-950 cursor-pointer"
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between text-xs text-forest-800">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-cream-300 text-forest-800 focus:ring-lime-brand cursor-pointer"
                />
                <span>Keep session active on this browser</span>
              </label>
            </div>

            {/* Submit Action */}
            <Button
              type="submit"
              variant="lime"
              size="lg"
              className="w-full font-black text-sm"
              disabled={isSubmitting || !password.trim()}
              iconLeft={<LockOpen className="w-4 h-4" />}
            >
              {isSubmitting ? 'Verifying...' : 'Unlock Portal (پورٹل کھولیں)'}
            </Button>
          </form>

          {/* Store Info Footer Note */}
          <div className="pt-4 border-t border-cream-200 text-center space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-xs text-forest-800 font-bold">
              <Store className="w-3.5 h-3.5 text-forest-700" />
              <span>{STORE_INFO.name}</span>
            </div>
            <p className="text-[11px] text-forest-600">
              {STORE_INFO.address} • Phone: {STORE_INFO.phone}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}

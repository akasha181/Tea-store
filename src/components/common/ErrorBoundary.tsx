import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw, Home, Phone } from 'lucide-react'
import { STORE_INFO } from '../../data/products'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by Hafiz Jee ErrorBoundary:', error, errorInfo)
  }

  private handleReload = () => {
    window.location.reload()
  }

  private handleGoHome = () => {
    window.location.href = '/'
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-cream-100 flex items-center justify-center p-4 sm:p-6 text-forest-950">
          <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-forest-xl border border-cream-300 text-center space-y-6">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-800">
              <AlertTriangle className="w-8 h-8 text-amber-700" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-forest-950">
                Temporary Display Issue
              </h1>
              <p className="text-sm font-urdu font-bold text-forest-700">
                معذرت، صفحہ لوڈ کرنے میں عارضی دشواری پیش آئی ہے
              </p>
              <p className="text-xs text-forest-700/80 leading-relaxed">
                Your basket and saved customer details remain safely stored in your browser. Reloading the store will restore normal functionality.
              </p>
            </div>

            {/* Helpline Notice */}
            <div className="p-3.5 rounded-2xl bg-cream-50 border border-cream-200 text-xs text-forest-800 space-y-1">
              <p className="font-bold">Need Immediate Assistance?</p>
              <p className="text-[11px] text-forest-700/80">
                Store Counter: {STORE_INFO.address}
              </p>
              <a
                href={`tel:${STORE_INFO.phone}`}
                className="inline-flex items-center gap-1 font-bold text-forest-700 hover:underline pt-0.5"
              >
                <Phone className="w-3.5 h-3.5 text-forest-700" />
                <span>Call Hotline: {STORE_INFO.phone}</span>
              </a>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition-colors shadow-forest-sm cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload Store (دوبارہ کھولیں)</span>
              </button>

              <button
                type="button"
                onClick={this.handleGoHome}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-cream-200 hover:bg-cream-300 text-forest-900 font-bold py-3 px-4 rounded-xl text-xs transition-colors cursor-pointer"
              >
                <Home className="w-3.5 h-3.5 text-forest-700" />
                <span>Go to Home</span>
              </button>
            </div>

            {/* Developer debug info if present */}
            {this.state.error && import.meta.env.DEV && (
              <details className="text-left text-[10px] text-rose-800 bg-rose-50 p-3 rounded-xl border border-rose-200 overflow-x-auto">
                <summary className="font-bold cursor-pointer">Technical Details</summary>
                <pre className="mt-1 font-mono">{this.state.error.toString()}</pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

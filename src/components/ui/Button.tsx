import React from 'react'

export type ButtonVariant =
  | 'forest'
  | 'primary'
  | 'lime'
  | 'cream'
  | 'white'
  | 'outline'
  | 'ghost'
  | 'danger'

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  fullWidth?: boolean
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  isLoading?: boolean
  children: React.ReactNode
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'forest',
  size = 'md',
  fullWidth = false,
  iconLeft,
  iconRight,
  isLoading = false,
  className = '',
  disabled,
  children,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-150 motion-reduce:transition-none motion-reduce:transform-none active:scale-[0.98] motion-reduce:active:scale-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer'

  const sizeStyles: Record<ButtonSize, string> = {
    xs: 'text-xs px-2.5 py-1 gap-1 rounded-lg',
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-4.5 py-2.5 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5 text-base',
  }

  const variantStyles: Record<ButtonVariant, string> = {
    forest:
      'bg-forest-700 hover:bg-forest-800 active:bg-forest-900 text-white focus:ring-forest-600 shadow-forest-sm',
    primary:
      'bg-forest-700 hover:bg-forest-800 active:bg-forest-900 text-white focus:ring-forest-600 shadow-forest-sm',
    lime:
      'bg-lime-brand hover:bg-lime-accent active:bg-lime-dark text-forest-950 font-semibold focus:ring-lime-brand shadow-sm',
    cream:
      'bg-cream-200 hover:bg-cream-300 text-forest-900 focus:ring-cream-300 border border-cream-300/80',
    white:
      'bg-white hover:bg-cream-50 active:bg-cream-100 text-forest-900 border border-cream-300 shadow-xs focus:ring-forest-300',
    outline:
      'border-2 border-forest-700/30 text-forest-800 bg-transparent hover:bg-forest-50 hover:border-forest-700 focus:ring-forest-500',
    ghost:
      'bg-transparent hover:bg-forest-100/60 text-forest-800 focus:ring-forest-400',
    danger:
      'bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white focus:ring-rose-500 shadow-sm',
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthStyle} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin motion-reduce:animate-none mr-2" />
      ) : (
        iconLeft && <span className="shrink-0">{iconLeft}</span>
      )}
      <span>{children}</span>
      {!isLoading && iconRight && <span className="shrink-0">{iconRight}</span>}
    </button>
  )
}

import React from 'react'

export type BadgeVariant =
  | 'forest'
  | 'lime'
  | 'cream'
  | 'white'
  | 'warning'
  | 'danger'
  | 'outline'
  | 'default'
  | 'success'

export type BadgeSize = 'sm' | 'md'

export interface BadgeProps {
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
  dotColor?: string
  className?: string
  children: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'forest',
  size = 'md',
  dot = false,
  dotColor,
  className = '',
  children,
}) => {
  const sizeStyles: Record<BadgeSize, string> = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
  }

  const variantStyles: Record<BadgeVariant, string> = {
    forest: 'bg-forest-100 text-forest-800 border-forest-200',
    lime: 'bg-lime-100 text-lime-dark border-lime-brand/40 font-semibold',
    cream: 'bg-cream-200 text-forest-900 border-cream-300',
    white: 'bg-white text-forest-900 border-cream-300 shadow-2xs',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-700 border-rose-200',
    outline: 'bg-transparent border border-forest-700/30 text-forest-800',
    default: 'bg-cream-100 text-forest-800 border-cream-300',
    success: 'bg-forest-100 text-forest-700 border-forest-200',
  }

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border transition-colors ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            dotColor || (variant === 'lime' ? 'bg-lime-dark' : 'bg-forest-600')
          }`}
        />
      )}
      {children}
    </span>
  )
}

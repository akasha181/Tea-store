import React from 'react'

export type CardVariant = 'default' | 'white' | 'cream' | 'forest' | 'outline'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant
  interactive?: boolean
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  interactive = false,
  className = '',
  children,
  onClick,
  onKeyDown,
  role,
  tabIndex,
  ...props
}) => {
  const variantStyles: Record<CardVariant, string> = {
    default: 'bg-white border border-cream-300 text-forest-950 shadow-forest-sm',
    white: 'bg-white border border-cream-300 text-forest-950 shadow-forest-sm',
    cream: 'bg-cream-50 border border-cream-300 text-forest-950 shadow-forest-sm',
    forest: 'bg-forest-800 border border-forest-700 text-cream-50 shadow-forest-md',
    outline: 'bg-transparent border-2 border-cream-300 text-forest-950',
  }

  const interactiveStyles = interactive
    ? 'hover:shadow-forest-lg hover:-translate-y-0.5 motion-reduce:hover:translate-y-0 transition-all duration-200 motion-reduce:transition-none cursor-pointer focus-visible:ring-2 focus-visible:ring-forest-600 focus-visible:outline-none'
    : 'transition-shadow duration-200 motion-reduce:transition-none'

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (interactive && onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick(e as unknown as React.MouseEvent<HTMLDivElement>)
    }
    onKeyDown?.(e)
  }

  return (
    <div
      role={role || (interactive ? 'button' : undefined)}
      tabIndex={tabIndex ?? (interactive ? 0 : undefined)}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className={`rounded-2xl ${variantStyles[variant]} ${interactiveStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  )
}

export const CardHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 sm:p-5 border-b border-cream-200/80 ${className}`} {...props}>
    {children}
  </div>
)

export const CardTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <h3 className={`font-bold text-base sm:text-lg text-forest-900 tracking-tight ${className}`} {...props}>
    {children}
  </h3>
)

export const CardDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <p className={`text-xs sm:text-sm text-forest-700/70 mt-1 ${className}`} {...props}>
    {children}
  </p>
)

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 sm:p-5 ${className}`} {...props}>
    {children}
  </div>
)

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = '',
  children,
  ...props
}) => (
  <div className={`p-4 sm:p-5 pt-0 flex items-center justify-between ${className}`} {...props}>
    {children}
  </div>
)

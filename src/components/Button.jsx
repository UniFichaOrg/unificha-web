const buttonVariants = {
  primary: 'text-white shadow-[var(--shadow-soft)]',
  secondary: 'bg-secondary text-foreground hover:bg-secondary/80',
  ghost: 'text-foreground hover:bg-secondary',
  outline: 'border border-border text-foreground hover:bg-secondary',
};

const buttonSizes = {
  sm: 'px-3 py-1.5 text-sm',
  base: 'px-5 py-3 text-sm font-semibold',
  lg: 'px-6 py-4 text-base font-semibold',
};

export function Button({
  children,
  variant = 'primary',
  size = 'base',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      disabled={isDisabled}
      className={`
        rounded-full transition disabled:opacity-50 disabled:cursor-not-allowed
        ${buttonVariants[variant]}
        ${buttonSizes[size]}
        ${variant === 'primary' && 'hover:brightness-105'}
        ${className}
      `}
      style={variant === 'primary' ? { background: 'var(--gradient-brand)' } : undefined}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}

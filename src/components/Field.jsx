export function Field({ label, icon, error, children, required = false, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-foreground flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <div className="flex items-center gap-3 rounded-xl border bg-secondary px-4 py-3 transition focus-within:border-teal focus-within:ring-1 focus-within:ring-teal">
          {icon && (
            <div className="text-muted-foreground flex-shrink-0">
              {icon}
            </div>
          )}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
      {error && (
        <p className="text-xs text-red-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}

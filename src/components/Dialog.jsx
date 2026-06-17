export function Dialog({ open, onOpenChange, title, children, className = '' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50">
      <div className={`bg-card rounded-3xl sm:rounded-2xl border shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto ${className}`}>
        <div className="sticky top-0 border-b bg-card p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-lg hover:bg-secondary text-muted-foreground"
          >
            ✕
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

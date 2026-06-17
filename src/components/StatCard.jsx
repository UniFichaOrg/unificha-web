const toneColors = {
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950/30',
    text: 'text-teal-700 dark:text-teal-400',
    border: 'border-teal-200 dark:border-teal-800',
    icon: 'text-teal-600 dark:text-teal-400',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    border: 'border-green-200 dark:border-green-800',
    icon: 'text-green-600 dark:text-green-400',
  },
  amber: {
    bg: 'bg-amber-50 dark:bg-amber-950/30',
    text: 'text-amber-700 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
    icon: 'text-amber-600 dark:text-amber-400',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/30',
    text: 'text-blue-700 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'text-blue-600 dark:text-blue-400',
  },
};

export function StatCard({ icon: Icon, label, value, tone = 'teal', delta }) {
  const colors = toneColors[tone] || toneColors.teal;

  return (
    <div className={`rounded-2xl border ${colors.border} ${colors.bg} p-5 shadow-[var(--shadow-card)]`}>
      <div className="flex items-start gap-3">
        {Icon && (
          <div className={`p-2 rounded-lg ${colors.icon}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-foreground">
              {value}
            </span>
            {delta && (
              <span className={`text-xs font-medium ${colors.text}`}>
                {delta}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

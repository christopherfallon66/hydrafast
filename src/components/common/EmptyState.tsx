interface EmptyStateProps {
  icon?: string;
  title: string;
  message: string;
}

export function EmptyState({ icon = '💧', title, message }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="text-4xl mb-3">{icon}</div>
      <h3 className="text-lg font-semibold text-deep-ocean mb-1">{title}</h3>
      <p className="text-text-secondary text-sm max-w-xs">{message}</p>
    </div>
  );
}

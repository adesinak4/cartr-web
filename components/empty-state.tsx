import { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: ReactNode;
  title: string;
  body?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-grey-200 py-16 text-center">
      {icon && (
        <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-full bg-grey-100 text-grey-400">
          {icon}
        </div>
      )}
      <p className="text-sm font-medium text-dark">{title}</p>
      {body && <p className="max-w-xs text-sm text-grey-500">{body}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}

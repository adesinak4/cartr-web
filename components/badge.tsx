const STYLES: Record<string, string> = {
  pending: "bg-warning-light text-warning",
  confirmed: "bg-blue-light text-blue",
  shipped: "bg-[#F3E8FF] text-[#7E22CE]",
  delivered: "bg-success-light text-success",
  cancelled: "bg-error-light text-error",
  refunded: "bg-grey-100 text-grey-500",
  active: "bg-success-light text-success",
  suspended: "bg-grey-100 text-grey-500",
  trialing: "bg-blue-light text-blue",
  past_due: "bg-warning-light text-warning",
  draft: "bg-grey-100 text-grey-500",
  archived: "bg-grey-100 text-grey-400",
};

export function Badge({ status, label }: { status: string; label?: string }) {
  const style = STYLES[status] ?? "bg-grey-100 text-grey-500";
  const text = label ?? status.replace(/_/g, " ");

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${style}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {text}
    </span>
  );
}

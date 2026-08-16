import { ReactNode } from "react";

const CHIP_COLORS: Record<string, string> = {
  blue: "bg-blue-light text-blue",
  orange: "bg-orange-light text-orange",
  green: "bg-success-light text-success",
  yellow: "bg-warning-light text-warning",
};

export function StatCard({
  icon,
  color = "blue",
  label,
  value,
  change,
  changeTone = "neutral",
}: {
  icon: ReactNode;
  color?: "blue" | "orange" | "green" | "yellow";
  label: string;
  value: string | number;
  change?: string;
  changeTone?: "positive" | "warning" | "neutral";
}) {
  const changeColor =
    changeTone === "positive"
      ? "text-success"
      : changeTone === "warning"
        ? "text-warning"
        : "text-grey-400";

  return (
    <div className="rounded-lg border border-grey-200 p-6 shadow-card">
      <div
        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-md ${CHIP_COLORS[color]}`}
      >
        {icon}
      </div>
      <p className="text-sm text-grey-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-dark">{value}</p>
      {change && <p className={`mt-1 text-xs ${changeColor}`}>{change}</p>}
    </div>
  );
}


import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  isPositive?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard = ({
  title,
  value,
  change,
  isPositive = true,
  isLoading = false,
  icon,
  className,
}: StatCardProps) => {
  if (isLoading) {
    return (
      <div className={cn("glass-card rounded-xl p-6 flex flex-col space-y-2 animate-pulse", className)}>
        <div className="h-4 bg-muted rounded w-1/2"></div>
        <div className="h-8 bg-muted rounded w-1/3 mt-2"></div>
        <div className="h-4 bg-muted rounded w-1/4 mt-1"></div>
      </div>
    );
  }

  return (
    <div className={cn(
      "glass-card rounded-xl p-6 transition-all duration-300 animate-scale-in",
      "hover:shadow-md hover:translate-y-[-2px]",
      className
    )}>
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        {icon && <div className="text-primary/80">{icon}</div>}
      </div>
      <p className="text-2xl font-semibold">{value}</p>
      {change && (
        <p className={cn(
          "mt-1 text-sm flex items-center",
          isPositive ? "text-green-600" : "text-red-600"
        )}>
          <span className="mr-1">{isPositive ? "↑" : "↓"}</span>
          {change}
        </p>
      )}
    </div>
  );
};

export default StatCard;

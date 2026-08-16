import React from 'react';
import { Card, CardContent } from './Card';
import { cn } from '../../lib/utils';
import { LucideIcon } from 'lucide-react';

interface StatTileProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
  iconClassName?: string;
}

export function StatTile({ title, value, icon: Icon, trend, className, iconClassName }: StatTileProps) {
  return (
    <Card className={cn("overflow-hidden hover:shadow-glass transition-shadow duration-300", className)}>
      <CardContent className="p-0 flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <div className="flex items-baseline gap-2">
            <h4 className="text-3xl font-bold text-text tracking-tight">{value}</h4>
            {trend && (
              <span className={cn(
                "text-xs font-medium px-2 py-0.5 rounded-full",
                trend.isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
              )}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
            )}
          </div>
        </div>
        <div className={cn("p-4 rounded-2xl bg-gray-50", iconClassName)}>
          <Icon className="w-6 h-6 text-gray-700" />
        </div>
      </CardContent>
    </Card>
  );
}
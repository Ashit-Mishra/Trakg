import React from 'react';
import { cn } from '../../lib/utils';
import { SkeletonLoader } from './SkeletonLoader';

interface Column<T> {
  key: string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading,
  emptyMessage = "No data available",
  className
}: DataTableProps<T>) {
  return (
    <div className={cn("w-full overflow-x-auto rounded-3xl border border-gray-100 bg-white shadow-sm", className)}>
      <table className="w-full text-left text-sm text-text">
        <thead className="bg-gray-50/50 text-gray-500 uppercase tracking-wider text-xs font-semibold">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-6 py-4 font-medium">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <tr key={i} className="animate-fade-in">
                {columns.map((col, j) => (
                  <td key={col.key + j} className="px-6 py-4">
                    <SkeletonLoader className="h-4 w-3/4" />
                  </td>
                ))}
              </tr>
            ))
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-500 font-medium">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-gray-50/50 transition-colors duration-200 group"
              >
                {columns.map((col) => (
                  <td key={col.key} className="px-6 py-4 whitespace-nowrap">
                    {col.render ? col.render(item) : String((item as any)[col.key] || '')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
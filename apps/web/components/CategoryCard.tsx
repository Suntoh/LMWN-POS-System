import { Order, OrderItems } from "@/app/type";
import React, { useMemo } from "react";
interface CategoryCardProps {
  filteredOrders: Order[];
}

function CateforyCard({ filteredOrders }: CategoryCardProps) {
  const categoryData = useMemo(() => {
    const categoryCount: Record<string, number> = {};
    filteredOrders.forEach((order) => {
      order.items?.forEach((item: OrderItems) => {
        const category = item.menuItem?.category || "Unknown";
        categoryCount[category] =
          (categoryCount[category] || 0) + item.quantity;
      });
    });

    const total = Object.values(categoryCount).reduce((a, b) => a + b, 0);
    const colors = [
      "#3B82F6",
      "#10B981",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
      "#06B6D4",
    ];

    return Object.entries(categoryCount).map(([name, value], index) => ({
      name,
      value,
      percentage: total > 0 ? ((value / total) * 100).toFixed(1) : 0,
      color: colors[index % colors.length],
    }));
  }, [filteredOrders]);

  const total = categoryData.reduce((acc, cat) => acc + cat.value, 0);

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-24 h-24">
        <svg viewBox="0 0 36 36" className="w-full h-full">
          {categoryData.reduce((acc: React.ReactNode[], cat, index) => {
            const prevPercentage = categoryData
              .slice(0, index)
              .reduce(
                (sum, c) => sum + (total > 0 ? (c.value / total) * 100 : 0),
                0,
              );
            const percentage = total > 0 ? (cat.value / total) * 100 : 0;
            acc.push(
              <circle
                key={cat.name}
                cx="18"
                cy="18"
                r="15.9155"
                fill="transparent"
                stroke={cat.color}
                strokeWidth="3"
                strokeDasharray={`${percentage} ${100 - percentage}`}
                strokeDashoffset={`${25 - prevPercentage}`}
              />,
            );
            return acc;
          }, [])}
        </svg>
      </div>
      <div className="flex-1 space-y-1 max-h-20 overflow-y-auto">
        {categoryData.map((cat) => (
          <div
            key={cat.name}
            className="flex items-center justify-between text-xs"
          >
            <div className="flex items-center gap-1">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: cat.color }}
              />
              <span className="text-gray-600 truncate max-w-16">
                {cat.name}
              </span>
            </div>
            <span className="text-gray-900 font-medium">{cat.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CateforyCard;

import { Order } from "@/app/type";
import React from "react";

interface CardProps {
  orders: Order[];
}

function MonthlyCompareCard({ orders }: CardProps) {
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;

  const thisMonthSales = orders
    .filter((order) => {
      const orderDate = new Date(order.date);
      return (
        orderDate.getMonth() === thisMonth &&
        orderDate.getFullYear() === thisYear
      );
    })
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const lastMonthSales = orders
    .filter((order) => {
      const orderDate = new Date(order.date);
      return (
        orderDate.getMonth() === lastMonth &&
        orderDate.getFullYear() === lastMonthYear
      );
    })
    .reduce((acc, order) => acc + order.totalPrice, 0);

  const remaining = lastMonthSales - thisMonthSales;

  return (
    <>
      <p className="text-sm text-gray-600">
        This Month:{" "}
        <span className="font-bold">{thisMonthSales.toFixed(2)} ฿</span>
      </p>
      <p className="text-sm text-gray-600">
        Last Month:{" "}
        <span className="font-bold">{lastMonthSales.toFixed(2)} ฿</span>
      </p>
      <p
        className={`text-sm mt-2 ${remaining > 0 ? "text-red-500" : "text-green-500"}`}
      >
        {remaining > 0
          ? `Need ${remaining.toFixed(2)} ฿ more to reach last month (${lastMonthSales > 0 ? ((thisMonthSales / lastMonthSales) * 100).toFixed(1) : 0}%)`
          : `Exceeded last month by ${Math.abs(remaining).toFixed(2)} ฿ (+${thisMonthSales > 0 ? (lastMonthSales > 0 ? (((thisMonthSales - lastMonthSales) / lastMonthSales) * 100).toFixed(1) : 100) : 0}%)`}
      </p>
    </>
  );
}

export default MonthlyCompareCard;

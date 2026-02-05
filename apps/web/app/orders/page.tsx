"use client";
import Navbar from "@/components/Navbar";
import React, { use, useEffect, useMemo, useState } from "react";

interface OrderResponse {
  id: string;
  tableNumber: number;
  status: number;
  totalPrice: number;
  discount: number;
  date?: string;
  createdAt?: string;
}

import { Order, OrderItems } from "../type";
import MonthlyCompareCard from "@/components/MonthlyCompareCard";
import CategoryCard from "@/components/CategoryCard";

type FilterType = "all" | "today" | "lastMonth";

export default function OrderSummaryPage() {
  const [filter, setFilter] = useState<FilterType>("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

  useEffect(() => {
    fetch(`${SERVER_URL}/api/orders`)
      .then((res) => res.json())
      .then((data) => {
        setOrders(
          data.data.map((order: OrderResponse) => ({
            ...order,
            date: order.createdAt || order.date || "",
            totalPrice: parseFloat(String(order.totalPrice)),
          })),
        );
        console.log(data);
      });
  }, [SERVER_URL]);

  const { totalIncome, filteredOrders } = useMemo(() => {
    let filtered = orders;

    if (filter === "today") {
      const today = new Date().toISOString().split("T")[0];
      filtered = orders.filter((order) => order.date.split("T")[0] === today);
    } else if (filter === "lastMonth") {
      const now = new Date();
      const lastMonth = now.getMonth() - 1;
      const lastMonthYear =
        lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear();
      const adjustedLastMonth = lastMonth < 0 ? 11 : lastMonth;

      filtered = orders.filter((order) => {
        const orderDate = new Date(order.date);
        return (
          orderDate.getMonth() === adjustedLastMonth &&
          orderDate.getFullYear() === lastMonthYear
        );
      });
    }
    return {
      totalIncome: filtered.reduce((acc, order) => acc + order.totalPrice, 0),
      filteredOrders: filtered,
    };
  }, [orders, filter]);
  const navigate = (url: string) => {
    window.location.href = url;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Navbar />
      <div className="max-w-6xl mx-auto py-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Income {filter}</p>
            <p className="text-3xl font-bold text-gray-900">{totalIncome} ฿</p>
            <p className="text-sm text-gray-400 mt-2">
              {filteredOrders.length} orders
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Total Discount:{" "}
              {filteredOrders.reduce(
                (acc, order) => acc + parseFloat(String(order.discount)),
                0,
              )}{" "}
              ฿
            </p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Monthly Comparison</p>
            <MonthlyCompareCard orders={orders} />
          </div>
          <div>
            <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <p className="text-sm text-gray-500 mb-3">Sales by Category</p>
              <CategoryCard filteredOrders={filteredOrders} />
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFilter("all")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    filter === "all"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("today")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    filter === "today"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilter("lastMonth")}
                  className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                    filter === "lastMonth"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Last Month
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Transaction ID
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount Paid
                  </th>
                  <th className="text-left py-4 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    onClick={() => navigate(`/orders/${order.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {order.id}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-600">
                      {order.date.split("T")[0]}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {order.totalPrice} ฿
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900 font-medium">
                      {order.discount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Implement pagination */}
          <div className="p-6 text-center border-t border-gray-200">
            <button className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
              Load More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect, use } from "react";

import { Order } from "@/app/type";

function OrderStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [order, setOrder] = useState<Order | null>(null);
  const [showDiscountInput, setShowDiscountInput] = useState(false);
  const [discountValue, setDiscountValue] = useState("");
  const [isPercentage, setIsPercentage] = useState(true);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [afterDiscount, setAfterDiscount] = useState(0);
  const [loading, setLoading] = useState(true);
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";
  useEffect(() => {
    if (appliedDiscount > 0 && order) {
      const newTotal = order.totalPrice - appliedDiscount;
      setAfterDiscount(newTotal >= 0 ? newTotal : 0);
    } else if (order) {
      setAfterDiscount(order.totalPrice);
    }
  }, [appliedDiscount, order]);
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        fetch(`${SERVER_URL}/api/orders/${id}`)
          .then((res) => res.json())
          .then((data) => {
            console.log(data);
            setOrder(data.data);
          });
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, SERVER_URL]);

  const handlePayment = async () => {
    if (!order) return;
    setOrder({ ...order, status: "paid" });
    handleDiscount();
    try {
      fetch(`${SERVER_URL}/api/orders/${order.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: "paid" }),
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleDiscount = () => {
    if (!order) return;
    if (appliedDiscount == 0) return;
    if (isPercentage) {
      try {
        fetch(`${SERVER_URL}/api/orders/${id}/discount-percentage`, {
          method: "POST",
          body: JSON.stringify({
            discountPercentage: discountValue,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error applying percentage discount:", error);
      }
    } else if (!isPercentage) {
      try {
        fetch(`${SERVER_URL}/api/orders/${id}/discount`, {
          method: "POST",
          body: JSON.stringify({
            discount: discountValue,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Error applying amount discount:", error);
      }
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen">
        Order not found
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="border-b pb-4 mb-4">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p className="text-gray-500">
            Date: {new Date(order.date).toLocaleString()}
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-semibold ${
              order.status === "paid"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {order.status === "paid" ? "Paid" : "Pending Payment"}
          </span>
        </div>

        {/* Order Items Table */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Order Items</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-3 text-left">Item</th>
                <th className="border p-3 text-right">Unit Price</th>
                <th className="border p-1 text-center">Quantity</th>
                <th className="border p-3 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="border p-3">{item.menuItem.name}</td>
                  <td className="border p-3 text-right">฿{item.unitPrice}</td>
                  <td className="border p-3 text-center">{item.quantity}</td>
                  <td className="border p-3 text-right">฿{item.subtotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="border-t pt-4 mb-6">
          <div className="flex justify-between items-center text-xl font-bold">
            <span>Total:</span>
            <span className="text-2xl text-gray-600">฿{order.totalPrice}</span>
          </div>
        </div>
        <div className="flex items-end justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowDiscountInput(!showDiscountInput)}
              className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
            >
              {showDiscountInput ? "Cancel Discount" : "Add Discount"}
            </button>
            {showDiscountInput && (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={isPercentage ? "Enter %" : "Enter amount"}
                  className="border rounded-lg px-3 py-2 w-32"
                  min="0"
                />
                <button
                  onClick={() => setIsPercentage(!isPercentage)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-colors ${
                    isPercentage
                      ? "bg-slate-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {isPercentage ? "%" : "฿"}
                </button>
                <button
                  onClick={() => {
                    const discount = isPercentage
                      ? (order.totalPrice * parseFloat(discountValue || "0")) /
                        100
                      : parseFloat(discountValue || "0");
                    setAppliedDiscount(discount);
                    setShowDiscountInput(false);
                  }}
                  className="bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
                >
                  Apply
                </button>
              </div>
            )}
          </div>
          {appliedDiscount > 0 && (
            <div className="mt-2 text-xl text-green-600 font-semibold">
              Discount Applied: ฿{appliedDiscount.toFixed(2)}
            </div>
          )}
        </div>
        <div>
          <div className="p-2 rounded-lg my-2">
            <p className="text-2xl font-semibold text-end  text-slate-700">
              After Discount: {afterDiscount}฿
            </p>
          </div>
        </div>
        <div className="flex gap-4 justify-between">
          <button
            onClick={() => window.history.back()}
            className="bg-gray-300 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            Back to Orders
          </button>
          {order.status !== "paid" ? (
            <>
              <button
                onClick={handlePayment}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Mark as Paid
              </button>
            </>
          ) : (
            <button
              onClick={handlePrintInvoice}
              className="bg-gray-300 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Print Invoice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderStatusPage;

import React, { useEffect } from "react";
import Image from "next/image";
import { OrderItem } from "@/app/type";

interface orderPanelProps {
  orderItems: OrderItem[];
  updateQuantity: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
  totalQuantity: number;
  total: number;
  orderNo: number;
  incrementOrderNo: () => void;
  toNextPage?: () => void;
  submitOrder: () => void;
}

function OrderPanel(props: orderPanelProps) {
  const {
    orderItems,
    updateQuantity,
    removeItem,
    totalQuantity,
    total,
    orderNo,
    incrementOrderNo,
    toNextPage,
    submitOrder,
  } = props;
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";

  return (
    <div className="w-80 h-[calc(100vh-64px)] bg-white p-4 flex flex-col">
      <h2 className="font-bold text-lg mb-4">Order #{orderNo}</h2>
      <div className="flex-1 overflow-auto">
        {orderItems.map((item) => (
          <div key={item.id} className="flex items-center gap-3 py-3 border-b">
            <Image
              src={`/food-menu.png`}
              alt={item.name}
              width={50}
              height={50}
            />
            <div className="flex-1 ">
              <p className="font-medium text-sm">{item.name}</p>
              <p className="text-gray-500 text-xs whitespace-nowrap">
                {item.price}฿
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, -1)}
                className="w-6 h-6 border rounded hover:cursor-pointer"
              >
                -
              </button>
              <span className="w-6 text-center">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, 1)}
                className="w-6 h-6 border rounded hover:cursor-pointer"
              >
                +
              </button>
              <button
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:cursor-pointer"
              >
                🗑
              </button>
            </div>
            <p className="font-bold">{item.price * item.quantity} ฿</p>
          </div>
        ))}
      </div>
      <div className="border-t pt-4 mt-4">
        <div className="flex justify-between mb-2">
          <span>
            Items: {orderItems.length}, Quantity: {totalQuantity}
          </span>
        </div>
        <div className="flex justify-between text-xl font-bold mb-4">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <button
          className="w-full py-3 bg-black text-white rounded-lg hover:cursor-pointer"
          onClick={submitOrder}
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}

export default OrderPanel;

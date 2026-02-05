"use client";
import Navbar from "@/components/Navbar";
import OrderPanel from "@/components/OrderPanel";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { MenuItem, OrderItem } from "@/app/type";

const category = ["All", "Drink", "Food", "Dessert"];

function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("");
  const [orderNo, setOrderNo] = useState(() => {
    if (typeof window !== "undefined") {
      const savedOrderNo = localStorage.getItem("orderNo");
      if (savedOrderNo) {
        return parseInt(savedOrderNo, 10);
      }
    }
    return 100;
  });
  const [loading, setLoading] = useState(true); // implemetn loaoding
  const SERVER_URL = process.env.SERVER_URL || "http://localhost:8080";
  const orderNoRef = React.useRef(orderNo);

  // Keep ref in sync with state
  useEffect(() => {
    orderNoRef.current = orderNo;
  }, [orderNo]);

  // Save orderNo to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("orderNo", orderNo.toString());
  }, [orderNo]);

  useEffect(() => {
    fetch(`${SERVER_URL}/api/menu`)
      .then((res) => res.json())
      .then((data) => {
        setMenuItems(data.data);
        console.log(data);
      });
  }, [SERVER_URL]);

  const incrementOrderNo = () => {
    setOrderNo((prev) => (prev > 999 ? 100 : prev + 1));
  };

  const addToOrder = (item: MenuItem) => {
    setOrderItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id
            ? {
                ...i,
                quantity: i.quantity + 1,
                subtotal: i.unitPrice * (i.quantity + 1),
              }
            : i,
        );
      }
      return [
        ...prev,
        { ...item, quantity: 1, unitPrice: item.price, subtotal: item.price },
      ];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setOrderItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : item;
          }
          return item;
        })
        .filter((item) => item.quantity > 0),
    );
  };

  const removeItem = (id: number) => {
    setOrderItems((prev) => prev.filter((item) => item.id !== id));
  };

  const total = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const totalQuantity = orderItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );

  const toNextPage = () => {
    window.location.href = "/orders";
  };
  const submitOrder = () => {
    fetch(`${SERVER_URL}/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        tableNumber: 1,
        items: orderItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.success) {
          incrementOrderNo();
          toNextPage();
        } else {
          alert("Failed to submit order. Please try again.");
        }
        console.log(`${orderItems}`);
      })
      .catch((error) => {
        console.error("Error submitting order:", error);
      });
  };
  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] h-full bg-gray-100">
      <Navbar />
      <div className="flex">
        <div className="h-[calc(100vh-64px)] sticky top-16 self-start">
          <Sidebar
            category={category}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-4 gap-4">
            {menuItems
              .filter(
                (item) =>
                  activeCategory === "" ||
                  item.category === activeCategory ||
                  activeCategory === "All",
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg flex flex-col p-4 text-center shadow-md justify-between h-full"
                >
                  <div className="flex justify-center">
                    <Image
                      src={`/food-menu.png`}
                      alt={item.name}
                      width={100}
                      height={100}
                    />
                  </div>
                  <h3 className="font-medium text-sm">{item.name}</h3>
                  <p className="font-bold">{item.price} ฿</p>
                  <button
                    onClick={() => addToOrder(item)}
                    className="mt-2 w-full bg-black text-white hover:cursor-pointer py-2 rounded-lg text-sm"
                  >
                    Add
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div className="sticky h-[calc(100vh-64px)]  top-16 self-start">
          <OrderPanel
            orderItems={orderItems}
            updateQuantity={updateQuantity}
            removeItem={removeItem}
            totalQuantity={totalQuantity}
            total={total}
            orderNo={orderNo}
            incrementOrderNo={incrementOrderNo}
            toNextPage={toNextPage}
            submitOrder={submitOrder}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderPage;

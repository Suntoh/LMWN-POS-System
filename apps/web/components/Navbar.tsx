import React from "react";

function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-6 py-4 shadow-lg sticky top-0 z-50   ">
      <div className="flex items-center justify-between">
        <div className="text-xl font-bold text-gray-100">POS System</div>
        <ul className="flex space-x-6">
          <li>
            <a
              href="/orders"
              className={`px-4 py-2 rounded-md transition-colors ${
                typeof window !== "undefined" &&
                window.location.pathname === "/orders"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              Orders
            </a>
          </li>
          <li>
            <a
              href="/orders/new"
              className={`px-4 py-2 rounded-md transition-colors ${
                typeof window !== "undefined" &&
                window.location.pathname === "/orders/new"
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              New Order
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;

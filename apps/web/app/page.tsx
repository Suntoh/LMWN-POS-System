import Link from "next/link";
import React from "react";

function HomePage() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-black mb-8">Welcome</h1>
      <Link
        href="/orders"
        className="px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors"
      >
        Go to Orders Summary
      </Link>
    </div>
  );
}

export default HomePage;

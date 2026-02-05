"use client";

interface SidebarProps {
  category: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

function Sidebar({
  category,
  activeCategory,
  setActiveCategory,
}: SidebarProps) {
  return (
    <div className=" bg-white flex flex-col sticky h-[calc(100vh-64px)] items-center py-4 gap-6">
      {category.map((item) => (
        <button
          key={item}
          className={`hover:cursor-pointer flex flex-col items-center h-12 py-2 px-4 text-gray-600 hover:bg-gray-100 rounded-lg mx-2 ${activeCategory === item ? "bg-gray-200 text-black" : ""}`}
          onClick={() => setActiveCategory(item)}
        >
          <span className="text-xl">{item.split(" ")[0]}</span>
          <span>{item.split(" ")[1]}</span>
        </button>
      ))}
    </div>
  );
}
export default Sidebar;

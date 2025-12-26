
"use client";
import MenuManagementUI from "./MenuManagementUI";

export default function MenuManagement() {
  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">
      <h1 className="text-3xl font-extrabold mb-8 tracking-tight text-[#7a1313] flex items-center gap-2">
        <span>🍽️</span> Menu Management
      </h1>
      <MenuManagementUI />
    </div>
  );
}

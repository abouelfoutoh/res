import React, { useState } from "react";

export default function BranchManagement() {
  const [branches, setBranches] = useState([
    { id: 1, name: "فرع القاهرة" },
    { id: 2, name: "فرع الإسكندرية" },
  ]);
  const [newBranch, setNewBranch] = useState("");

  // إضافة فرع جديد
  const handleAddBranch = () => {
    if (newBranch.trim() === "") return;
    const newId = branches.length ? branches[branches.length - 1].id + 1 : 1;
    setBranches([...branches, { id: newId, name: newBranch }]);
    setNewBranch("");
  };

  // حذف فرع
  const handleDeleteBranch = (id) => {
    setBranches(branches.filter(branch => branch.id !== id));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">إدارة الفروع</h1>

      {/* إضافة فرع */}
      <div className="flex mb-6">
        <input
          type="text"
          placeholder="اسم الفرع الجديد"
          value={newBranch}
          onChange={(e) => setNewBranch(e.target.value)}
          className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleAddBranch}
          className="bg-blue-500 text-white px-4 rounded-r hover:bg-blue-600 transition"
        >
          إضافة
        </button>
      </div>

      {/* قائمة الفروع */}
      <ul>
        {branches.length === 0 && (
          <li className="text-center text-gray-500">لا يوجد فروع حالياً</li>
        )}
        {branches.map((branch) => (
          <li
            key={branch.id}
            className="flex justify-between items-center border-b py-2"
          >
            <span>{branch.name}</span>
            <button
              onClick={() => handleDeleteBranch(branch.id)}
              className="text-red-500 hover:text-red-700"
              title="حذف الفرع"
            >
              حذف
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

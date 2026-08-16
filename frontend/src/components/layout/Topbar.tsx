import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../context/useAuthStore";

export function Topbar() {
  const navigate = useNavigate();

  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-6">

      {/* Left side */}
      <div>
        {/* Keep your existing Topbar content here */}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Keep your existing profile/notification UI here */}

        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>

      </div>
    </header>
  );
}
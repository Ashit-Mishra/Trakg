import React from 'react';
import { Bell, Search, LogOut } from 'lucide-react';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function Topbar() {
  return (
    <header className="h-16 flex items-center justify-between px-8 bg-white/70 backdrop-blur-md border-b border-gray-100 z-10 sticky top-0">
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50/50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="h-6 w-px bg-gray-200 mx-2"></div>
        <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-600 hover:bg-red-50 gap-2 rounded-full">
          <LogOut size={16} />
          <span>Logout</span>
        </Button>
      </div>
    </header>
  );
}
import React from 'react';
import { Search } from 'lucide-react';
import { Input, InputProps } from './Input';

export function SearchBar(props: InputProps) {
  return (
    <Input
      icon={<Search size={18} />}
      placeholder="Search..."
      className="bg-gray-50/50 border-transparent focus:bg-white"
      {...props}
    />
  );
}
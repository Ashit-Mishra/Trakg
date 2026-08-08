import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Calendar, 
  Clock, 
  Settings,
  GraduationCap,
  ClipboardList
} from 'lucide-react';
import { cn } from '../../lib/utils';
// import { useAuthStore } from '../../context/useAuthStore';

// Temporary mock until auth is implemented
const useAuthStore = () => ({
  user: { role: 'ADMIN' }
});

const adminLinks = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/teachers', icon: Users, label: 'Teachers' },
  { to: '/admin/students', icon: GraduationCap, label: 'Students' },
  { to: '/admin/departments', icon: BookOpen, label: 'Departments' },
  { to: '/admin/subjects', icon: BookOpen, label: 'Subjects' },
  { to: '/admin/class-sections', icon: Users, label: 'Class Sections' },
  { to: '/admin/academic-sessions', icon: Calendar, label: 'Academic Sessions' },
  { to: '/admin/assignments', icon: ClipboardList, label: 'Assignments' },
  { to: '/admin/users', icon: Settings, label: 'Users' },
];

const teacherLinks = [
  { to: '/teacher/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/teacher/assignments', icon: ClipboardList, label: 'My Assignments' },
  { to: '/teacher/attendance', icon: Clock, label: 'Take Attendance' },
  { to: '/teacher/history', icon: Calendar, label: 'Attendance History' },
  { to: '/teacher/profile', icon: Settings, label: 'Profile' },
];

const studentLinks = [
  { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/student/attendance', icon: Clock, label: 'Attendance Details' },
  { to: '/student/profile', icon: Settings, label: 'Profile' },
];

export function Sidebar() {
  const { user } = useAuthStore();
  const location = useLocation();
  
  let links = adminLinks;
  if (user?.role === 'TEACHER') links = teacherLinks;
  if (user?.role === 'STUDENT') links = studentLinks;

  return (
    <aside className="w-64 flex-shrink-0 glass-dark text-white flex flex-col transition-all duration-300">
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-accent flex items-center justify-center shadow-lg">
            <span className="font-bold text-lg">A</span>
          </div>
          <span className="font-semibold tracking-wide">Tracker ERP</span>
        </div>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 no-scrollbar">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname.startsWith(link.to);
          
          return (
            <NavLink
              key={link.to}
              to={link.to}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-white/10 text-white shadow-sm backdrop-blur-md" 
                  : "text-gray-400 hover:text-gray-100 hover:bg-white/5"
              )}
            >
              <Icon size={20} className={cn("transition-colors", isActive ? "text-primary" : "text-gray-400")} />
              {link.label}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-white/5">
          <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-medium">
            {user?.role.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.role}</p>
            <p className="text-xs text-gray-400 truncate">user@example.com</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
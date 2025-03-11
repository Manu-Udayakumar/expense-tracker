import React from 'react';
import {
  Building2,
  Users,
  CalendarCheck,
  Wallet,
  ClipboardList,
  Settings,
  LogOut,
  UserCog,
  Home,
  BarChart,
  Bell,
  IndianRupee
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Dashboard', icon: Home, path: '/' },
  { name: 'Staff', icon: Users, path: '/staff' },
  { name: 'Properties', icon: Building2, path: '/properties' },
  { name: 'Expenses', icon: Wallet, path: '/expenses' },
  { name: 'Revenue', icon: IndianRupee, path: '/revenue' }, // Changed DollarSign to IndianRupee
  { name: 'Reports', icon: BarChart, path: '/reports' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const isAdmin = true; // This would come from your auth context

  return (
    <div className="w-64 h-screen bg-gray-50 fixed left-0 top-0 shadow-lg flex flex-col">
      <div className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-white shadow-[inset_-2px_-2px_4px_rgba(0,0,0,0.1),_inset_2px_2px_4px_rgba(255,255,255,0.9)] flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800">StayManager</h1>
        </div>

        <nav className="flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => navigate(category.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white hover:shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] transition-all duration-200"
            >
              <category.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">{category.name}</span>
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => navigate('/staff-management')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white hover:shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] transition-all duration-200"
            >
              <UserCog className="w-5 h-5 flex-shrink-0" />
              <span className="truncate">Staff Management</span>
            </button>
          )}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-200 space-y-2">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white hover:shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] transition-all duration-200">
          <Bell className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Notifications</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white hover:shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] transition-all duration-200">
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Settings</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-white hover:shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)] transition-all duration-200">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

import React from 'react';
import {
  Building2,
  Users,
  Wallet,
  BarChart,
  Bell,
  IndianRupee,
  Settings,
  LogOut,
  UserCog,
  Home,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const categories = [
  { name: 'dashboard', icon: Home, path: '/dashboard' },
  { name: 'staff', icon: Users, path: '/staff' },
  { name: 'properties', icon: Building2, path: '/properties' },
  { name: 'expenses', icon: Wallet, path: '/expenses' },
  { name: 'revenue', icon: IndianRupee, path: '/revenue' },
  { name: 'reports', icon: BarChart, path: '/reports' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { t } = useTranslation();
  const isAdmin = true; // Replace with real auth logic

  return (
    <div className="w-64 h-screen bg-gray-50 fixed left-0 top-0 shadow-lg flex flex-col sm:w-20 sm:items-center lg:w-64">
      <div className="p-4 sm:p-2 lg:p-6 flex-shrink-0">
        <div className="flex items-center gap-3 mb-6 sm:flex-col sm:gap-1 lg:flex-row lg:mb-8">
          <div className="w-10 h-10 rounded-xl bg-white shadow flex items-center justify-center">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-gray-800 sm:hidden lg:block">StayManager</h1>
        </div>

        <nav className="flex flex-col gap-2 overflow-y-auto flex-grow">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => navigate(category.path)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white hover:shadow transition-all duration-200 sm:justify-center sm:px-2 lg:justify-start lg:px-4"
            >
              <category.icon className="w-5 h-5 flex-shrink-0" />
              <span className="truncate sm:hidden lg:block">{t(category.name)}</span>
            </button>
          ))}

          {isAdmin && (
            <button
              onClick={() => navigate('/staff-management')}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-white hover:shadow transition-all duration-200 sm:justify-center sm:px-2 lg:justify-start lg:px-4"
            >
              <UserCog className="w-5 h-5 flex-shrink-0" />
              <span className="truncate sm:hidden lg:block">{t('staffManagement')}</span>
            </button>
          )}
        </nav>
      </div>

      <div className="p-4 sm:p-2 lg:p-6 border-t border-gray-200 space-y-2 flex-shrink-0">
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-white hover:shadow transition-all duration-200 sm:justify-center sm:px-2 lg:justify-start lg:px-4">
          <Bell className="w-5 h-5 flex-shrink-0" />
          <span className="truncate sm:hidden lg:block">{t('notifications')}</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-gray-700 hover:bg-white hover:shadow transition-all duration-200 sm:justify-center sm:px-2 lg:justify-start lg:px-4">
          <Settings className="w-5 h-5 flex-shrink-0" />
          <span className="truncate sm:hidden lg:block">{t('settings')}</span>
        </button>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-xl text-red-600 hover:bg-white hover:shadow transition-all duration-200 sm:justify-center sm:px-2 lg:justify-start lg:px-4"
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          <span className="truncate sm:hidden lg:block">{t('logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
import React from 'react';
import { DollarSign, TrendingUp, Building2, Users, CalendarCheck, AlertTriangle, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 rounded-xl border border-gray-200 bg-white">
            <option>All Properties</option>
            <option>Seaside Villa</option>
            <option>Mountain Lodge</option>
            <option>City Apartments</option>
          </select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Stats Cards */}
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">$45,250</h3>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" /> +12% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Total Expenses</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">$28,150</h3>
          <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" /> +8% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Net Profit</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">$17,100</h3>
          <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
            <TrendingUp className="w-4 h-4" /> +15% from last month
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Staff Expenses</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">$12,450</h3>
          <p className="text-sm text-gray-600 mt-2">24 active staff</p>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {[
            { type: 'expense', category: 'Maintenance', amount: -350, property: 'Seaside Villa - Room 204', time: '10 mins ago' },
            { type: 'revenue', category: 'Booking', amount: 1200, property: 'Mountain Lodge - Suite 12', time: '25 mins ago' },
            { type: 'expense', category: 'Supplies', amount: -180, property: 'City Apartments - Unit 45', time: '1 hour ago' },
          ].map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center`}>
                  {transaction.type === 'expense' ? 
                    <ArrowDownRight className={`w-5 h-5 ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`} /> :
                    <ArrowUpRight className={`w-5 h-5 ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`} />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.category}</p>
                  <p className="text-sm text-gray-500">{transaction.property}</p>
                </div>
              </div>
              <div className="text-right">
                <p className={`font-medium ${transaction.type === 'expense' ? 'text-red-600' : 'text-green-600'}`}>
                  {transaction.type === 'expense' ? '-' : '+'}${Math.abs(transaction.amount)}
                </p>
                <p className="text-sm text-gray-500">{transaction.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Expense Categories */}
      <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Expense Categories</h3>
        <div className="space-y-4">
          {[
            { category: 'Maintenance & Repairs', amount: 8250, percentage: 35 },
            { category: 'Staff Salaries', amount: 12450, percentage: 28 },
            { category: 'Utilities', amount: 4200, percentage: 20 },
            { category: 'Supplies', amount: 3250, percentage: 17 },
          ].map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">{category.category}</span>
                <span className="font-medium">${category.amount}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full"
                  style={{ width: `${category.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
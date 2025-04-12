import { useEffect, useState } from 'react';
import { DollarSign, Users, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const Dashboard = () => {
  const [financialOverview, setFinancialOverview] = useState({
    totalRevenue: 0,
    totalExpenses: 0,
    netProfit: 0,
    staffExpenses: 0,
  });

  interface Transaction {
    type: 'expense' | 'income';
    category: string;
    property: string;
    amount: number;
    paymentMethod: string;
    time: string;
  }

  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  interface ExpenseCategory {
    category: string;
    amount: number;
    percentage: number;
  }

  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>([]);

  useEffect(() => {
    fetchFinancialOverview();
    fetchRecentTransactions();
    fetchExpenseCategories();
  }, []);

  // Fetch Financial Overview
  const fetchFinancialOverview = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/financial-overview");
      const data = await response.json();
      setFinancialOverview(data);
    } catch (error) {
      console.error("Error fetching financial overview:", error);
    }
  };

  // Fetch Recent Transactions (Includes Payment Method)
  const fetchRecentTransactions = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/recent-transactions");
      const data = await response.json();
      setRecentTransactions(data);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
    }
  };

  // Fetch Expense Categories (Excluding Revenue)
  const fetchExpenseCategories = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/dashboard/expense-categories");
      const data = await response.json();
      const filteredData = data.filter((category: ExpenseCategory) => category.category.toLowerCase() !== 'revenue');
      setExpenseCategories(filteredData);
    } catch (error) {
      console.error("Error fetching expense categories:", error);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">Financial Overview</h2>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">${financialOverview.totalRevenue}</h3>
        </div>

        {/* Total Expenses */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">Total Expenses</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">${financialOverview.totalExpenses}</h3>
        </div>

        {/* Net Profit */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Net Profit</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">${financialOverview.netProfit}</h3>
        </div>

        {/* Staff Expenses */}
        <div className="bg-white rounded-2xl p-6 shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Staff Expenses</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">${financialOverview.staffExpenses}</h3>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Transactions</h3>
        <div className="space-y-4">
          {recentTransactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition">
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-lg ${transaction.type === 'expense' ? 'bg-red-100' : 'bg-green-100'} flex items-center justify-center`}>
                  {transaction.type === 'expense' ? 
                    <ArrowDownRight className="w-5 h-5 text-red-600" /> :
                    <ArrowUpRight className="w-5 h-5 text-green-600" />
                  }
                </div>
                <div>
                  <p className="font-medium text-gray-800">{transaction.category}</p>
                  {/* <p className="text-sm text-gray-500">{transaction.property}</p> */}
                  <p className="text-sm text-gray-500">Payment: {transaction.paymentMethod}</p>
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

      {/* Expense Categories (Excluding Revenue) */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Expense Categories</h3>
        <div className="space-y-4">
          {expenseCategories.map((category, index) => (
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

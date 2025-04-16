// src/components/Dashboard.tsx
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

interface FinancialOverview {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  staffExpenses: number;
  revenueTrend?: number;
  expensesTrend?: number;
  profitTrend?: number;
}

interface Transaction {
  type: "expense" | "revenue";
  category: string;
  method: string;
  amount: number;
  time: string;
}

interface ExpenseCategory {
  category: string;
  amount: number;
  percentage: number;
}

const Dashboard = () => {
  const [financialOverview, setFinancialOverview] = useState<FinancialOverview>(
    {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      staffExpenses: 0,
    }
  );
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>(
    []
  );
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [selectedProperty, setSelectedProperty] =
    useState<string>("All Properties");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!isAuthenticated || !token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        await Promise.all([
          fetchFinancialOverview(token, selectedProperty),
          fetchRecentTransactions(token, selectedProperty),
          fetchExpenseCategories(token, selectedProperty),
        ]);
      } catch (err) {
        if (err instanceof Error && err.message === "Token expired") {
          console.log("Token expired or invalid, redirecting to login...");
          logout();
          navigate("/login", { state: { sessionExpired: true } });
        } else {
          setError(t("failedToLoadData"));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, navigate, selectedProperty, t, logout]);

  const fetchFinancialOverview = async (token: string, property: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboard/financial-overview?property=${encodeURIComponent(
          property
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        if (response.status === 403) throw new Error("Token expired");
        throw new Error("Failed to fetch financial overview");
      }
      const data = await response.json();
      setFinancialOverview({
        totalRevenue: Number(data.totalRevenue) || 0,
        totalExpenses: Number(data.totalExpenses) || 0,
        netProfit: Number(data.netProfit) || 0,
        staffExpenses: Number(data.staffExpenses) || 0,
        revenueTrend: data.revenueTrend,
        expensesTrend: data.expensesTrend,
        profitTrend: data.profitTrend,
      });
    } catch (error) {
      console.error("Error fetching financial overview:", error);
      throw error;
    }
  };

  const fetchRecentTransactions = async (token: string, property: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboard/recent-transactions?property=${encodeURIComponent(
          property
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        if (response.status === 403) throw new Error("Token expired");
        throw new Error("Failed to fetch transactions");
      }
      const data = await response.json();
      setRecentTransactions(data || []);
    } catch (error) {
      console.error("Error fetching recent transactions:", error);
      throw error;
    }
  };

  const fetchExpenseCategories = async (token: string, property: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboard/expense-categories?property=${encodeURIComponent(
          property
        )}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!response.ok) {
        if (response.status === 403) throw new Error("Token expired");
        throw new Error("Failed to fetch expense categories");
      }
      const data = await response.json();
      const filteredData = (data || []).filter(
        (category: ExpenseCategory) =>
          category.category.toLowerCase() !== "revenue"
      );
      setExpenseCategories(filteredData);
    } catch (error) {
      console.error("Error fetching expense categories:", error);
      throw error;
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nLng", lng);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen text-lg">
        {t("loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          {t("financialOverview")}
        </h2>
        <div className="flex items-center gap-4">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white"
          >
            <option>All Properties</option>
            <option>Seaside Villa</option>
            <option>Mountain Lodge</option>
            <option>City Apartments</option>
          </select>
          <div className="flex gap-2">
            <button
              onClick={() => changeLanguage("en")}
              className={`px-3 py-1 rounded-lg text-sm ${
                i18n.language === "en"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white transition`}
            >
              English
            </button>
            <button
              onClick={() => changeLanguage("hi")}
              className={`px-3 py-1 rounded-lg text-sm ${
                i18n.language === "hi"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700"
              } hover:bg-blue-500 hover:text-white transition`}
            >
              हिंदी
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <ArrowUpRight className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">{t("totalRevenue")}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            ₹{financialOverview.totalRevenue.toLocaleString()}
          </h3>
          {financialOverview.revenueTrend !== undefined && (
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />{" "}
              {financialOverview.revenueTrend > 0 ? "+" : ""}
              {financialOverview.revenueTrend}% {t("fromLastMonth")}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="w-6 h-6 text-red-600" />
            </div>
            <span className="text-sm text-gray-500">{t("totalExpenses")}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            ₹{financialOverview.totalExpenses.toLocaleString()}
          </h3>
          {financialOverview.expensesTrend !== undefined && (
            <p className="text-sm text-red-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />{" "}
              {financialOverview.expensesTrend > 0 ? "+" : ""}
              {financialOverview.expensesTrend}% {t("fromLastMonth")}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">{t("netProfit")}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            ₹{financialOverview.netProfit.toLocaleString()}
          </h3>
          {financialOverview.profitTrend !== undefined && (
            <p className="text-sm text-green-600 flex items-center gap-1 mt-2">
              <TrendingUp className="w-4 h-4" />{" "}
              {financialOverview.profitTrend > 0 ? "+" : ""}
              {financialOverview.profitTrend}% {t("fromLastMonth")}
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">{t("staffExpenses")}</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            ₹{financialOverview.staffExpenses.toLocaleString()}
          </h3>
          <p className="text-sm text-gray-600 mt-2">
            {t("activeStaff", { count: 24 })}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {t("recentTransactions")}
        </h3>
        <div className="space-y-4">
          {recentTransactions.length > 0 ? (
            recentTransactions.map((transaction, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`w-10 h-10 rounded-lg ${
                      transaction.type === "expense"
                        ? "bg-red-100"
                        : "bg-green-100"
                    } flex items-center justify-center`}
                  >
                    {transaction.type === "expense" ? (
                      <ArrowDownRight className="w-5 h-5 text-red-600" />
                    ) : (
                      <ArrowUpRight className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">
                      {transaction.category}
                    </p>
                    <p className="text-sm text-gray-500">
                      {transaction.method}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`font-medium ${
                      transaction.type === "expense"
                        ? "text-red-600"
                        : "text-green-600"
                    }`}
                  >
                    {transaction.type === "expense" ? "-" : "+"}₹
                    {Math.abs(transaction.amount).toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">{transaction.time}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">{t("noTransactions")}</p>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
        <h3 className="text-xl font-bold text-gray-800 mb-4">
          {t("expenseCategories")}
        </h3>
        <div className="space-y-4">
          {expenseCategories.length > 0 ? (
            expenseCategories.map((category, index) => {
              console.log(
                `Category: ${category.category}, Amount: ₹${category.amount}, Percentage: ${category.percentage}%`
              );
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">{category.category}</span>
                    <span className="font-medium">
                      ₹{category.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${category.percentage}%` }}
                    />
                  </div>
                </div>
              );
            })
          ) : (
            <p className="text-gray-500">{t("noCategories")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

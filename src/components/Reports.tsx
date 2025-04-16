// src/components/Reports.tsx
import React, { useState, useEffect } from "react";
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface MonthlyData {
  month: number;
  year: number;
  revenue: number;
  expenses: number;
  profit: number;
}

interface ExpenseCategory {
  category: string;
  amount: number;
}

const Reports = () => {
  const { isAuthenticated } = useAuth();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [expenseCategories, setExpenseCategories] = useState<ExpenseCategory[]>(
    []
  );
  const [properties, setProperties] = useState<string[]>(["All Properties"]);
  const [selectedProperty, setSelectedProperty] =
    useState<string>("All Properties");
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [showStaffBreakdown, setShowStaffBreakdown] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch properties
  const fetchProperties = async (token: string) => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/dashboard/properties",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch properties");
      const data = await response.json();
      setProperties(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching properties"
      );
    }
  };

  // Fetch monthly analytics
  // src/components/Reports.tsx (partial update)
  const fetchMonthlyAnalytics = async (token: string) => {
    try {
      console.log("Fetching monthly analytics with:", {
        selectedProperty,
        selectedYear,
      });
      const response = await fetch(
        `http://localhost:5000/api/dashboard/monthly-analytics?property=${encodeURIComponent(
          selectedProperty
        )}&year=${selectedYear}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch monthly analytics");
      const data = await response.json();
      setMonthlyData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching monthly analytics");
    }
  };

  // Fetch expense categories
  const fetchExpenseCategories = async (token: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/dashboard/expense-categories?property=${encodeURIComponent(
          selectedProperty
        )}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch expense categories");
      const data = await response.json();
      setExpenseCategories(
        data.filter(
          (cat: ExpenseCategory) => cat.category.toLowerCase() !== "revenue"
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error fetching expense categories"
      );
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      setError("Please log in to view reports.");
      setLoading(false);
      return;
    }

    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      setError("No authentication token found.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      await Promise.all([
        fetchProperties(token),
        fetchMonthlyAnalytics(token),
        fetchExpenseCategories(token),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [isAuthenticated, selectedProperty, selectedYear]);

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 text-lg">
        Loading Reports...
      </div>
    );
  if (error)
    return (
      <div className="flex items-center justify-center h-screen text-red-600">
        {error}
      </div>
    );

  // Monthly Trends Chart
  const monthlyChartData = {
    labels: monthlyData.map((d) =>
      new Date(0, d.month - 1).toLocaleString("default", { month: "short" })
    ),
    datasets: [
      {
        label: "Revenue",
        data: monthlyData.map((d) => d.revenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Expenses",
        data: monthlyData.map((d) => Math.abs(d.expenses)),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Profit",
        data: monthlyData.map((d) => d.profit),
        borderColor: "rgba(54, 162, 235, 1)",
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const monthlyChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: {
        display: true,
        text: `Monthly Trends (${selectedProperty}, ${selectedYear})`,
      },
    },
    scales: {
      y: { beginAtZero: true, title: { display: true, text: "Amount (₹)" } },
      x: { title: { display: true, text: "Month" } },
    },
  };

  // Expense Categories Pie Chart
  const pieChartData = {
    labels: expenseCategories.map((c) => c.category),
    datasets: [
      {
        data: expenseCategories.map((c) => c.amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#C9CBCF",
          "#7D4F6D",
          "#D4A5A5",
          "#6B7280",
        ],
        hoverOffset: 4,
      },
    ],
  };

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const },
      title: { display: true, text: `Expense Breakdown (${selectedProperty})` },
    },
  };

  return (
    <div className="p-8 space-y-8">
      {/* Header with Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Financial Reports</h1>
        <div className="flex gap-4">
          <select
            value={selectedProperty}
            onChange={(e) => setSelectedProperty(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {properties.map((prop) => (
              <option key={prop} value={prop}>
                {prop}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {Array.from(
              { length: 5 },
              (_, i) => new Date().getFullYear() - i
            ).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            onClick={() => setShowStaffBreakdown(!showStaffBreakdown)}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            {showStaffBreakdown ? "Hide Staff Details" : "Show Staff Details"}
          </button>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
        <Line data={monthlyChartData} options={monthlyChartOptions} />
      </div>

      {/* Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <Pie data={pieChartData} options={pieChartOptions} />
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Expense Details
          </h3>
          <ul className="space-y-2">
            {expenseCategories.map((cat, index) => (
              <li key={index} className="flex justify-between text-gray-700">
                <span>{cat.category}</span>
                <span>₹{cat.amount.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Staff Breakdown (Toggleable) */}
      {showStaffBreakdown && (
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <h3 className="text-xl font-bold text-gray-800 mb-4">
            Staff Expenses
          </h3>
          <p className="text-gray-600">
            Staff expense data requires a separate endpoint or filtering by
            category 'Salaries'. Currently showing placeholder: ₹
            {monthlyData
              .reduce((sum, d) => sum + Math.abs(d.expenses) * 0.3, 0)
              .toLocaleString()}{" "}
            (30% of total expenses).
          </p>
          {/* Add staff-specific logic here if you have a staff endpoint */}
        </div>
      )}
    </div>
  );
};

export default Reports;

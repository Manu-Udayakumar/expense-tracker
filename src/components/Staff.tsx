import React, { useState, useEffect } from "react";
import axios from "axios";
import { Users, UserCheck, Award, AlertTriangle, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Staff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  interface StaffMember {
    staff_id: number;
    user_id: number;
    name: string;
    role: string;
    status: string;
    performance: number;
    transactions: number;
    last_active: string;
    recent_activity: string | null;
    email: string;
    phone: string;
    created_at: string;
  }

  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([]);
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchStaff = async () => {
      setIsLoading(true);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const response = await axios.get("http://localhost:5000/api/staff/all", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const staffData = Array.isArray(response.data) ? response.data : [];
        setStaffMembers(staffData);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 403) {
          logout();
          navigate('/login');
        } else {
          setErrorMessage(t("staffDetails.error.failedToLoad"));
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchStaff();
  }, [isAuthenticated, t, logout, navigate]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!isAuthenticated) {
      setErrorMessage(t("staffDetails.error.notAuthenticated"));
      return;
    }

    const trimmedStaff = {
      name: newStaff.name.trim(),
      role: newStaff.role.trim(),
      email: newStaff.email.trim(),
      phone: newStaff.phone.trim(),
    };

    const errors: string[] = [];
    if (!trimmedStaff.name) errors.push(t("staffDetails.error.nameRequired"));
    if (!trimmedStaff.role) errors.push(t("staffDetails.error.roleRequired"));
    if (!trimmedStaff.email) errors.push(t("staffDetails.error.emailRequired"));
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedStaff.email))
      errors.push(t("staffDetails.error.invalidEmail"));
    if (!trimmedStaff.phone) errors.push(t("staffDetails.error.phoneRequired"));
    else if (!/^\d{10}$/.test(trimmedStaff.phone))
      errors.push(t("staffDetails.error.invalidPhone"));

    if (errors.length > 0) {
      setErrorMessage(
        `${t("staffDetails.error.fixErrors")}\n- ${errors.join("\n- ")}`
      );
      return;
    }

    setIsLoading(true);
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/api/staff/add",
        trimmedStaff,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.staff) {
        const newStaffMember = {
          ...response.data.staff,
          performance: response.data.staff.performance || 0,
          transactions: response.data.staff.transactions || 0,
        };
        setStaffMembers((prevMembers) => [...prevMembers, newStaffMember]);
        alert(t("staffDetails.success.added"));
        setIsModalOpen(false);
        setNewStaff({ name: "", role: "", email: "", phone: "" });
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        logout();
        navigate('/login');
      } else if (axios.isAxiosError(error) && error.response) {
        setErrorMessage(
          error.response.data.error || t("staffDetails.error.failedToAdd")
        );
      } else {
        setErrorMessage(t("staffDetails.error.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (staffId: number, newStatus: string) => {
    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/staff/${staffId}/status`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.staff) {
        setStaffMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.staff_id === staffId
              ? { ...member, status: newStatus, performance: response.data.staff.performance }
              : member
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        logout();
        navigate('/login');
      } else {
        alert(t("staffDetails.error.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTransactions = async (staffId: number, newTransactions: number) => {
    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/staff/${staffId}/transactions`,
        { transactions: newTransactions },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.data.staff) {
        setStaffMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.staff_id === staffId
              ? { ...member, transactions: newTransactions, performance: response.data.staff.performance }
              : member
          )
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        logout();
        navigate('/login');
      } else {
        alert(t("staffDetails.error.unexpected"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveStaff = async (id: number) => {
    if (!window.confirm(t("staffDetails.confirm.remove"))) return;

    setIsLoading(true);
    try {
      const token =
        localStorage.getItem("token") || sessionStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStaffMembers(staffMembers.filter((staff) => staff.staff_id !== id));
      alert(t("staffDetails.success.removed"));
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 403) {
        logout();
        navigate('/login');
      } else {
        alert(t("staffDetails.error.failedToRemove"));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const topPerformer =
    staffMembers.length > 0
      ? staffMembers.reduce((prev, current) =>
          (current.performance || 0) > (prev.performance || 0) ? current : prev
        )
      : null;

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 bg-gray-100 min-h-screen">
      <div className="max-w-full sm:max-w-4xl lg:max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            {t("staffDetails.title")}
          </h2>
          <button
            onClick={() => setIsModalOpen(true)}
            disabled={isLoading}
            className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
          >
            {t("staffDetails.addNew")}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {t("staffDetails.totalStaff")}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
              {isLoading ? "..." : staffMembers.length}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                <UserCheck className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {t("staffDetails.activeNow")}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
              {isLoading
                ? "..."
                : staffMembers.filter((staff) => staff.status === "active").length}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-yellow-100 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 sm:w-6 h-5 sm:h-6 text-yellow-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {t("staffDetails.pendingReviews")}
              </span>
            </div>
            <h3 className="text-lg sm:text-2xl font-bold text-gray-800">
              {isLoading ? "..." : 5}
            </h3>
          </div>
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg flex flex-col items-start">
            <div className="flex items-center justify-between w-full mb-3 sm:mb-4">
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
                <Award className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
              </div>
              <span className="text-xs sm:text-sm text-gray-500">
                {t("staffDetails.topPerformer")}
              </span>
            </div>
            {isLoading ? (
              <h3 className="text-base sm:text-lg font-bold text-gray-800">...</h3>
            ) : staffMembers.length > 0 && topPerformer ? (
              <>
                <h3 className="text-base sm:text-lg font-bold text-gray-800 truncate w-full">
                  {topPerformer.name}
                </h3>
                <p className="text-xs sm:text-sm text-purple-600 mt-1">
                  {t("staffDetails.efficiency", {
                    value: typeof topPerformer.performance === "number" ? topPerformer.performance : 0,
                  })}
                </p>
              </>
            ) : (
              <h3 className="text-base sm:text-lg font-bold text-gray-800">N/A</h3>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg mt-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
            {t("staffDetails.performance")}
          </h3>
          {isLoading ? (
            <div className="text-center text-gray-600">
              {t("staffDetails.loading")}
            </div>
          ) : staffMembers.length === 0 ? (
            <div className="text-center text-gray-600">
              {t("staffDetails.noStaff")}
            </div>
          ) : (
            <div className="space-y-4">
              <table className="hidden md:table w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      {t("staffDetails.table.staffMember")}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      {t("staffDetails.table.role")}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      {t("staffDetails.table.status")}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      {t("staffDetails.table.performance")}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      {t("staffDetails.table.transactions")}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      {t("staffDetails.table.lastActive")}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      {t("staffDetails.table.recentActivity")}
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">
                      {t("staffDetails.table.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {staffMembers.map((member) => (
                    <tr
                      key={member.staff_id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-medium text-gray-600">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-medium text-gray-800 block truncate max-w-[150px]">
                              {member.name}
                            </span>
                            <span className="text-sm text-gray-500 block truncate max-w-[150px]">
                              {member.email}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[120px]">
                        {t(`staffDetails.roles.${member.role}`)}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={member.status}
                          onChange={(e) => handleUpdateStatus(member.staff_id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-sm border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            member.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                          disabled={isLoading}
                        >
                          <option value="active" className="bg-green-100 text-green-600">
                            {t("staffDetails.status.active")}
                          </option>
                          <option value="inactive" className="bg-red-100 text-red-600">
                            {t("staffDetails.status.inactive")}
                          </option>
                        </select>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            <div
                              className={`h-full rounded-full ${
                                member.performance >= 90
                                  ? "bg-green-600"
                                  : member.performance >= 70
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                              }`}
                              style={{ width: `${member.performance}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {member.performance}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        <input
                          type="number"
                          min="0"
                          value={member.transactions}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            handleUpdateTransactions(member.staff_id, newValue);
                          }}
                          className="w-16 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                          disabled={isLoading}
                        />
                      </td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[120px]">
                        {new Date(member.last_active).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-gray-600 truncate max-w-[150px]">
                        {member.recent_activity || t("staffDetails.none")}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleRemoveStaff(member.staff_id)}
                          disabled={isLoading}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400"
                        >
                          {t("staffDetails.remove")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="md:hidden space-y-4">
                {staffMembers.map((member) => (
                  <div
                    key={member.staff_id}
                    className="bg-gray-50 rounded-xl p-4 shadow-sm flex flex-col gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-lg font-medium text-gray-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium text-gray-800 block truncate">
                          {member.name}
                        </span>
                        <span className="text-sm text-gray-500 block truncate">
                          {member.email}
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">
                          {t("staffDetails.table.role")}:
                        </span>
                        <span className="text-gray-800 truncate max-w-[60%]">
                          {t(`staffDetails.roles.${member.role}`)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">
                          {t("staffDetails.table.status")}:
                        </span>
                        <select
                          value={member.status}
                          onChange={(e) => handleUpdateStatus(member.staff_id, e.target.value)}
                          className={`px-2 py-1 rounded-full text-xs border-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            member.status === "active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                          disabled={isLoading}
                        >
                          <option value="active" className="bg-green-100 text-green-600">
                            {t("staffDetails.status.active")}
                          </option>
                          <option value="inactive" className="bg-red-100 text-red-600">
                            {t("staffDetails.status.inactive")}
                          </option>
                        </select>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">
                          {t("staffDetails.table.performance")}:
                        </span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden flex-shrink-0">
                            <div
                              className={`h-full rounded-full ${
                                member.performance >= 90
                                  ? "bg-green-600"
                                  : member.performance >= 70
                                  ? "bg-yellow-600"
                                  : "bg-red-600"
                              }`}
                              style={{ width: `${member.performance}%` }}
                            />
                          </div>
                          <span className="text-gray-600">
                            {member.performance}%
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">
                          {t("staffDetails.table.transactions")}:
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={member.transactions}
                          onChange={(e) => {
                            const newValue = parseInt(e.target.value) || 0;
                            handleUpdateTransactions(member.staff_id, newValue);
                          }}
                          className="w-16 px-2 py-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">
                          {t("staffDetails.table.lastActive")}:
                        </span>
                        <span className="text-gray-800 truncate max-w-[60%]">
                          {new Date(member.last_active).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 font-medium">
                          {t("staffDetails.table.recentActivity")}:
                        </span>
                        <span className="text-gray-800 truncate max-w-[60%]">
                          {member.recent_activity || t("staffDetails.none")}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveStaff(member.staff_id)}
                      disabled={isLoading}
                      className="text-red-600 hover:text-red-800 transition-colors disabled:text-gray-400 text-left"
                    >
                      {t("staffDetails.remove")}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md sm:max-w-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800">
                  {t("staffDetails.modal.title")}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  disabled={isLoading}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>
              {errorMessage && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 whitespace-pre-line">
                  {errorMessage}
                </div>
              )}
              <form
                onSubmit={handleAddStaff}
                className="space-y-4 sm:space-y-6"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("staffDetails.modal.fullName")} *
                  </label>
                  <input
                    type="text"
                    required
                    value={newStaff.name}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, name: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder={t("staffDetails.modal.placeholder.name")}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("staffDetails.modal.role")} *
                  </label>
                  <select
                    required
                    value={newStaff.role}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, role: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    disabled={isLoading}
                  >
                    <option value="">
                      {t("staffDetails.modal.placeholder.role")}
                    </option>
                    <option value="Property Manager">
                      {t("staffDetails.roles.Property Manager")}
                    </option>
                    <option value="Maintenance Supervisor">
                      {t("staffDetails.roles.Maintenance Supervisor")}
                    </option>
                    <option value="Front Desk">
                      {t("staffDetails.roles.Front Desk")}
                    </option>
                    <option value="Housekeeper">
                      {t("staffDetails.roles.Housekeeper")}
                    </option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("staffDetails.modal.email")} *
                  </label>
                  <input
                    type="email"
                    required
                    value={newStaff.email}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, email: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder={t("staffDetails.modal.placeholder.email")}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t("staffDetails.modal.phone")} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={newStaff.phone}
                    onChange={(e) =>
                      setNewStaff({ ...newStaff, phone: e.target.value })
                    }
                    className="w-full px-3 sm:px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                    placeholder={t("staffDetails.modal.placeholder.phone")}
                    disabled={isLoading}
                  />
                </div>
                <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors disabled:text-gray-400"
                  >
                    {t("staffDetails.modal.cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-400"
                  >
                    {isLoading
                      ? t("staffDetails.modal.adding")
                      : t("staffDetails.modal.add")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Staff;
import React, { useState } from 'react';
import { Users, UserCheck, UserX, Clock, TrendingUp, Award, AlertTriangle, X } from 'lucide-react';

const Staff = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Property Manager',
      status: 'active',
      performance: 95,
      transactions: 128,
      lastActive: '2 mins ago',
      recentActivity: 'Recorded $350 maintenance expense',
      email: 'sarah.j@example.com',
      phone: '+1 (555) 123-4567'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Maintenance Supervisor',
      status: 'active',
      performance: 88,
      transactions: 85,
      lastActive: '15 mins ago',
      recentActivity: 'Updated Room 204 status',
      email: 'michael.c@example.com',
      phone: '+1 (555) 234-5678'
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'Front Desk',
      status: 'inactive',
      performance: 75,
      transactions: 45,
      lastActive: '1 hour ago',
      recentActivity: 'Processed check-in for Suite 12',
      email: 'emily.r@example.com',
      phone: '+1 (555) 345-6789'
    }
  ]);

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: '',
    email: '',
    phone: ''
  });

  const handleAddStaff = (e) => {
    e.preventDefault();
    const newStaffMember = {
      id: staffMembers.length + 1,
      ...newStaff,
      status: 'active',
      performance: 0,
      transactions: 0,
      lastActive: 'Just added',
      recentActivity: 'New staff member'
    };
    setStaffMembers([...staffMembers, newStaffMember]);
    setIsModalOpen(false);
    setNewStaff({ name: '', role: '', email: '', phone: '' });
  };

  const handleRemoveStaff = (id) => {
    setStaffMembers(staffMembers.filter(staff => staff.id !== id));
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Staff Management</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
        >
          Add New Staff
        </button>
      </div>

      {/* Staff Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Staff</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{staffMembers.length}</h3>
          <p className="text-sm text-gray-600 mt-2">Across all properties</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <UserCheck className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Active Now</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {staffMembers.filter(staff => staff.status === 'active').length}
          </h3>
          <p className="text-sm text-green-600 mt-2">
            {Math.round((staffMembers.filter(staff => staff.status === 'active').length / staffMembers.length) * 100)}% of total staff
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Pending Reviews</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">5</h3>
          <p className="text-sm text-yellow-600 mt-2">Due this week</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Award className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Top Performer</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800">
            {staffMembers.reduce((prev, current) => 
              (prev.performance > current.performance) ? prev : current
            ).name}
          </h3>
          <p className="text-sm text-purple-600 mt-2">
            {staffMembers.reduce((prev, current) => 
              (prev.performance > current.performance) ? prev : current
            ).performance}% efficiency
          </p>
        </div>
      </div>

      {/* Staff Performance Table */}
      <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Staff Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Staff Member</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Role</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Status</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Performance</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Transactions</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Last Active</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Recent Activity</th>
                <th className="text-left py-4 px-4 font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {staffMembers.map((member) => (
                <tr key={member.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-gray-600">
                          {member.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-gray-800 block">{member.name}</span>
                        <span className="text-sm text-gray-500">{member.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{member.role}</td>
                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-600' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {member.status}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            member.performance >= 90 ? 'bg-green-600' :
                            member.performance >= 70 ? 'bg-yellow-600' :
                            'bg-red-600'
                          }`}
                          style={{ width: `${member.performance}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{member.performance}%</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-gray-600">{member.transactions}</td>
                  <td className="py-4 px-4 text-gray-600">{member.lastActive}</td>
                  <td className="py-4 px-4 text-gray-600">{member.recentActivity}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleRemoveStaff(member.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Staff Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add New Staff Member</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  required
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({...newStaff, role: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select role</option>
                  <option value="Property Manager">Property Manager</option>
                  <option value="Maintenance Supervisor">Maintenance Supervisor</option>
                  <option value="Front Desk">Front Desk</option>
                  <option value="Housekeeper">Housekeeper</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone
                </label>
                <input
                  type="tel"
                  required
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter phone number"
                />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
                >
                  Add Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;
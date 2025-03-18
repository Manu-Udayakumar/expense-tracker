import React, { useState } from 'react';
import { Building2, Users, Bed, DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, Star, X } from 'lucide-react';

const Properties = () => {
  const [selectedView, setSelectedView] = useState('grid');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [properties, setProperties] = useState([
    {
      id: 1,
      name: 'Seaside Villa',
      location: 'Miami Beach, FL',
      image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?auto=format&fit=crop&q=80&w=2340',
      rooms: 12,
      occupancy: 85,
      revenue: 45250,
      expenses: 28150,
      rating: 4.8,
      status: 'Operational'
    },
    {
      id: 2,
      name: 'Mountain Lodge',
      location: 'Aspen, CO',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=2340',
      rooms: 8,
      occupancy: 92,
      revenue: 38500,
      expenses: 22800,
      rating: 4.9,
      status: 'Operational'
    },
    {
      id: 3,
      name: 'City Apartments',
      location: 'New York, NY',
      image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=2340',
      rooms: 24,
      occupancy: 78,
      revenue: 62800,
      expenses: 41200,
      rating: 4.6,
      status: 'Maintenance'
    }
  ]);

  const [newProperty, setNewProperty] = useState({
    name: '',
    location: '',
    image: '',
    rooms: '',
    status: 'Operational'
  });

  const handleAddProperty = (e) => {
    e.preventDefault();
    const newPropertyEntry = {
      id: properties.length + 1,
      ...newProperty,
      rooms: parseInt(newProperty.rooms),
      occupancy: 0,
      revenue: 0,
      expenses: 0,
      rating: 0
    };
    setProperties([...properties, newPropertyEntry]);
    setIsModalOpen(false);
    setNewProperty({
      name: '',
      location: '',
      image: '',
      rooms: '',
      status: 'Operational'
    });
  };

  const handleRemoveProperty = (id) => {
    setProperties(properties.filter(property => property.id !== id));
  };
  
  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Properties Overview</h2>
        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setSelectedView('grid')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedView === 'grid' 
                  ? 'bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.1)]' 
                  : 'text-gray-600'
              }`}
            >
              Grid View
            </button>
            <button
              onClick={() => setSelectedView('list')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                selectedView === 'list' 
                  ? 'bg-white shadow-[4px_4px_10px_rgba(0,0,0,0.1)]' 
                  : 'text-gray-600'
              }`}
            >
              List View
            </button>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
          >
            Add Property
          </button>
        </div>
      </div>

      {/* Property Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm text-gray-500">Total Properties</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">{properties.length}</h3>
          <p className="text-sm text-gray-600 mt-2">
            {properties.reduce((acc, curr) => acc + curr.rooms, 0)} total rooms
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
              <Bed className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm text-gray-500">Average Occupancy</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {Math.round(properties.reduce((acc, curr) => acc + curr.occupancy, 0) / properties.length)}%
          </h3>
          <p className="text-sm text-green-600 mt-2">+5% from last month</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
              <Star className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm text-gray-500">Average Rating</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            {(properties.reduce((acc, curr) => acc + curr.rating, 0) / properties.length).toFixed(1)}
          </h3>
          <p className="text-sm text-purple-600 mt-2">From 1,250 reviews</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-yellow-100 flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm text-gray-500">Total Revenue</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-800">
            ${properties.reduce((acc, curr) => acc + curr.revenue, 0)}
          </h3>
          <p className="text-sm text-yellow-600 mt-2">This month</p>
        </div>
      </div>

      {selectedView === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-2xl overflow-hidden shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
              <div className="h-48 overflow-hidden relative group">
                <img 
                  src={property.image} 
                  alt={property.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveProperty(property.id)}
                  className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-800">{property.name}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    property.status === 'Operational' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {property.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{property.location}</p>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Rooms</p>
                    <p className="font-medium">{property.rooms}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Occupancy</p>
                    <p className="font-medium">{property.occupancy}%</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Revenue</p>
                    <p className="font-medium text-green-600">${property.revenue}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">Expenses</p>
                    <p className="font-medium text-red-600">${property.expenses}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-medium">{property.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_rgba(255,255,255,0.9)]">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Property</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Location</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Rooms</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Occupancy</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Revenue</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Expenses</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Rating</th>
                  <th className="text-left py-4 px-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden">
                          <img 
                            src={property.image} 
                            alt={property.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="font-medium text-gray-800">{property.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{property.location}</td>
                    <td className="py-4 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        property.status === 'Operational' 
                          ? 'bg-green-100 text-green-600' 
                          : 'bg-yellow-100 text-yellow-600'
                      }`}>
                        {property.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-gray-600">{property.rooms}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-blue-600 rounded-full"
                            style={{ width: `${property.occupancy}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{property.occupancy}%</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-green-600">${property.revenue}</td>
                    <td className="py-4 px-4 text-red-600">${property.expenses}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-gray-600">{property.rating}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleRemoveProperty(property.id)}
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
      )}

      {/* Add Property Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Add New Property</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Name
                </label>
                <input
                  type="text"
                  required
                  value={newProperty.name}
                  onChange={(e) => setNewProperty({...newProperty, name: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter property name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  required
                  value={newProperty.location}
                  onChange={(e) => setNewProperty({...newProperty, location: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter location"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  value={newProperty.image}
                  onChange={(e) => setNewProperty({...newProperty, image: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter image URL"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Rooms
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={newProperty.rooms}
                  onChange={(e) => setNewProperty({...newProperty, rooms: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter number of rooms"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  required
                  value={newProperty.status}
                  onChange={(e) => setNewProperty({...newProperty, status: e.target.value})}
                  className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Operational">Operational</option>
                  <option value="Maintenance">Maintenance</option>
                </select>
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
                  Add Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;

"use client";
import React, { useState, useEffect } from "react";
import { Save, Plus, Edit, Trash2, Building2 } from "lucide-react";

interface BusinessInfo {
  id: string;
  name: string;
  website: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  industry: string;
  createdAt: string;
  updatedAt: string;
}

const BusinessInfoForm = () => {
  const [businesses, setBusinesses] = useState<BusinessInfo[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<BusinessInfo | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    phone: "",
    email: "",
    address: "",
    industry: "",
  });

  useEffect(() => {
    // Load businesses from localStorage
    const savedBusinesses = localStorage.getItem("businesses");
    if (savedBusinesses) {
      setBusinesses(JSON.parse(savedBusinesses));
    }
  }, []);

  const saveBusinesses = (newBusinesses: BusinessInfo[]) => {
    setBusinesses(newBusinesses);
    localStorage.setItem("businesses", JSON.stringify(newBusinesses));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingBusiness) {
      // Update existing business
      const updatedBusinesses = businesses.map(business =>
        business.id === editingBusiness.id
          ? { ...business, ...formData, updatedAt: new Date().toISOString() }
          : business
      );
      saveBusinesses(updatedBusinesses);
    } else {
      // Add new business
      const newBusiness: BusinessInfo = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveBusinesses([...businesses, newBusiness]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      website: "",
      description: "",
      phone: "",
      email: "",
      address: "",
      industry: "",
    });
    setIsFormOpen(false);
    setEditingBusiness(null);
  };

  const handleEdit = (business: BusinessInfo) => {
    setFormData({
      name: business.name,
      website: business.website,
      description: business.description,
      phone: business.phone,
      email: business.email,
      address: business.address,
      industry: business.industry,
    });
    setEditingBusiness(business);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this business info?")) {
      const updatedBusinesses = businesses.filter(business => business.id !== id);
      saveBusinesses(updatedBusinesses);
    }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <Building2 className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Business Information</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Business</span>
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingBusiness ? "Edit Business Info" : "Add Business Info"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter business name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="https://example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="contact@business.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      value={formData.industry}
                      onChange={(e) => setFormData({...formData, industry: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Industry</option>
                      <option value="retail">Retail</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="education">Education</option>
                      <option value="automotive">Automotive</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="restaurant">Restaurant</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Full business address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of your business"
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-end space-y-2 sm:space-y-0 sm:space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{editingBusiness ? "Update" : "Save"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Business List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {businesses.map((business) => (
          <div key={business.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-gray-900 truncate">{business.name}</h3>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(business)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(business.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {business.website && (
              <p className="text-sm text-blue-600 mb-2 truncate">
                <a href={business.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  {business.website}
                </a>
              </p>
            )}
            
            {business.description && (
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{business.description}</p>
            )}
            
            <div className="space-y-1 text-xs text-gray-500">
              {business.email && <p>📧 {business.email}</p>}
              {business.phone && <p>📱 {business.phone}</p>}
              {business.industry && <p>🏢 {business.industry}</p>}
              {business.address && <p>📍 {business.address}</p>}
            </div>
          </div>
        ))}
      </div>

      {businesses.length === 0 && (
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No businesses added yet</h3>
          <p className="text-gray-500 mb-4">Add your first business information to get started.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Business Info
          </button>
        </div>
      )}
    </div>
  );
};

export default BusinessInfoForm;

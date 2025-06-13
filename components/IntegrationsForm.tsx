
"use client";
import React, { useState, useEffect } from "react";
import { Save, Plus, Edit, Trash2, Plug, CheckCircle, AlertCircle } from "lucide-react";

interface Integration {
  id: string;
  name: string;
  type: string;
  status: "connected" | "disconnected" | "error";
  configuration: Record<string, any>;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const IntegrationsForm = () => {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIntegration, setEditingIntegration] = useState<Integration | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    status: "disconnected" as Integration["status"],
    configuration: {} as Record<string, any>,
    description: "",
  });

  const integrationTypes = [
    { value: "whatsapp", label: "WhatsApp Business", fields: ["phone_number", "api_token"] },
    { value: "sms", label: "SMS Gateway", fields: ["api_key", "sender_id"] },
    { value: "email", label: "Email Service", fields: ["smtp_host", "smtp_port", "username", "password"] },
    { value: "webhook", label: "Webhook", fields: ["url", "secret"] },
    { value: "crm", label: "CRM Integration", fields: ["api_url", "api_key", "sync_enabled"] },
    { value: "payment", label: "Payment Gateway", fields: ["merchant_id", "api_key", "webhook_secret"] },
    { value: "analytics", label: "Analytics", fields: ["tracking_id", "property_id"] },
    { value: "social", label: "Social Media", fields: ["app_id", "app_secret", "access_token"] },
  ];

  useEffect(() => {
    const savedIntegrations = localStorage.getItem("integrations");
    if (savedIntegrations) {
      setIntegrations(JSON.parse(savedIntegrations));
    }
  }, []);

  const saveIntegrations = (newIntegrations: Integration[]) => {
    setIntegrations(newIntegrations);
    localStorage.setItem("integrations", JSON.stringify(newIntegrations));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingIntegration) {
      const updatedIntegrations = integrations.map(integration =>
        integration.id === editingIntegration.id
          ? { ...integration, ...formData, updatedAt: new Date().toISOString() }
          : integration
      );
      saveIntegrations(updatedIntegrations);
    } else {
      const newIntegration: Integration = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveIntegrations([...integrations, newIntegration]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      type: "",
      status: "disconnected",
      configuration: {},
      description: "",
    });
    setIsFormOpen(false);
    setEditingIntegration(null);
  };

  const handleEdit = (integration: Integration) => {
    setFormData({
      name: integration.name,
      type: integration.type,
      status: integration.status,
      configuration: integration.configuration,
      description: integration.description,
    });
    setEditingIntegration(integration);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this integration?")) {
      const updatedIntegrations = integrations.filter(integration => integration.id !== id);
      saveIntegrations(updatedIntegrations);
    }
  };

  const handleConfigurationChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      configuration: {
        ...formData.configuration,
        [field]: value
      }
    });
  };

  const getStatusColor = (status: Integration["status"]) => {
    switch (status) {
      case "connected": return "bg-green-100 text-green-800";
      case "error": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: Integration["status"]) => {
    switch (status) {
      case "connected": return <CheckCircle size={16} className="text-green-600" />;
      case "error": return <AlertCircle size={16} className="text-red-600" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const selectedType = integrationTypes.find(type => type.value === formData.type);

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <Plug className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Integrations</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Integration</span>
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingIntegration ? "Edit Integration" : "Add Integration"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Integration Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter integration name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => {
                        setFormData({
                          ...formData, 
                          type: e.target.value,
                          configuration: {} // Reset configuration when type changes
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      {integrationTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as Integration["status"]})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="disconnected">Disconnected</option>
                      <option value="connected">Connected</option>
                      <option value="error">Error</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Brief description of this integration"
                  />
                </div>

                {/* Configuration Fields */}
                {selectedType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Configuration
                    </label>
                    <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                      {selectedType.fields.map(field => (
                        <div key={field}>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            {field.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            {field.includes('password') || field.includes('secret') || field.includes('token') ? ' *' : ''}
                          </label>
                          <input
                            type={field.includes('password') || field.includes('secret') || field.includes('token') ? 'password' : 'text'}
                            value={formData.configuration[field] || ''}
                            onChange={(e) => handleConfigurationChange(field, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                            placeholder={`Enter ${field.replace(/_/g, ' ')}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                    <span>{editingIntegration ? "Update" : "Add"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Integrations List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {integrations.map((integration) => (
          <div key={integration.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 truncate mb-1">{integration.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(integration.status)}`}>
                    {integration.status}
                  </span>
                  {getStatusIcon(integration.status)}
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleEdit(integration)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(integration.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-blue-600 mb-2 capitalize">
              🔌 {integration.type.replace(/[-_]/g, ' ')}
            </p>
            
            {integration.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{integration.description}</p>
            )}
            
            <div className="text-xs text-gray-500">
              <p>Updated: {new Date(integration.updatedAt).toLocaleDateString()}</p>
              {Object.keys(integration.configuration).length > 0 && (
                <p className="mt-1">
                  {Object.keys(integration.configuration).length} config field(s)
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {integrations.length === 0 && (
        <div className="text-center py-12">
          <Plug size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No integrations configured</h3>
          <p className="text-gray-500 mb-4">Connect external services to enhance your chat experience.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Integration
          </button>
        </div>
      )}
    </div>
  );
};

export default IntegrationsForm;

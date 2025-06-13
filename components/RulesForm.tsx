
"use client";
import React, { useState, useEffect } from "react";
import { Save, Plus, Edit, Trash2, Settings, Play } from "lucide-react";

interface Rule {
  id: string;
  name: string;
  trigger: string;
  condition: string;
  action: string;
  status: "active" | "inactive";
  priority: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const RulesForm = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRule, setEditingRule] = useState<Rule | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    trigger: "",
    condition: "",
    action: "",
    status: "active" as Rule["status"],
    priority: 1,
    description: "",
  });

  useEffect(() => {
    const savedRules = localStorage.getItem("rules");
    if (savedRules) {
      setRules(JSON.parse(savedRules));
    }
  }, []);

  const saveRules = (newRules: Rule[]) => {
    setRules(newRules);
    localStorage.setItem("rules", JSON.stringify(newRules));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingRule) {
      const updatedRules = rules.map(rule =>
        rule.id === editingRule.id
          ? { ...rule, ...formData, updatedAt: new Date().toISOString() }
          : rule
      );
      saveRules(updatedRules);
    } else {
      const newRule: Rule = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveRules([...rules, newRule]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      trigger: "",
      condition: "",
      action: "",
      status: "active",
      priority: 1,
      description: "",
    });
    setIsFormOpen(false);
    setEditingRule(null);
  };

  const handleEdit = (rule: Rule) => {
    setFormData({
      name: rule.name,
      trigger: rule.trigger,
      condition: rule.condition,
      action: rule.action,
      status: rule.status,
      priority: rule.priority,
      description: rule.description,
    });
    setEditingRule(rule);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this rule?")) {
      const updatedRules = rules.filter(rule => rule.id !== id);
      saveRules(updatedRules);
    }
  };

  const getStatusColor = (status: Rule["status"]) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
  };

  const getPriorityColor = (priority: number) => {
    if (priority >= 8) return "bg-red-100 text-red-800";
    if (priority >= 5) return "bg-yellow-100 text-yellow-800";
    return "bg-blue-100 text-blue-800";
  };

  const getPriorityLabel = (priority: number) => {
    if (priority >= 8) return "High";
    if (priority >= 5) return "Medium";
    return "Low";
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <Settings className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Automation Rules</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Create Rule</span>
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingRule ? "Edit Rule" : "Create Rule"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rule Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter rule name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as Rule["status"]})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Trigger Event *
                    </label>
                    <select
                      required
                      value={formData.trigger}
                      onChange={(e) => setFormData({...formData, trigger: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Trigger</option>
                      <option value="new_message">New Message Received</option>
                      <option value="new_conversation">New Conversation Started</option>
                      <option value="keyword_detected">Keyword Detected</option>
                      <option value="business_hours">Business Hours</option>
                      <option value="customer_inactive">Customer Inactive</option>
                      <option value="payment_received">Payment Received</option>
                      <option value="form_submitted">Form Submitted</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority (1-10)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={formData.priority}
                      onChange={(e) => setFormData({...formData, priority: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Condition *
                  </label>
                  <textarea
                    required
                    value={formData.condition}
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Message contains 'pricing' OR customer is first-time visitor"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Action *
                  </label>
                  <textarea
                    required
                    value={formData.action}
                    onChange={(e) => setFormData({...formData, action: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Send welcome template, Assign to sales team, Add tag 'interested'"
                  />
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
                    placeholder="Brief description of what this rule does"
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
                    <span>{editingRule ? "Update" : "Create"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="space-y-4">
        {rules.map((rule) => (
          <div key={rule.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold text-gray-900">{rule.name}</h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(rule.status)}`}>
                    {rule.status}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(rule.priority)}`}>
                    {getPriorityLabel(rule.priority)}
                  </span>
                </div>
                
                {rule.description && (
                  <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                )}
                
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Trigger:</span>
                    <p className="text-gray-600 mt-1">{rule.trigger.replace(/_/g, ' ')}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Condition:</span>
                    <p className="text-gray-600 mt-1 line-clamp-2">{rule.condition}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Action:</span>
                    <p className="text-gray-600 mt-1 line-clamp-2">{rule.action}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                <button
                  onClick={() => handleEdit(rule)}
                  className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(rule.id)}
                  className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rules.length === 0 && (
        <div className="text-center py-12">
          <Settings size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No rules created yet</h3>
          <p className="text-gray-500 mb-4">Create automation rules to streamline your workflow.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Rule
          </button>
        </div>
      )}
    </div>
  );
};

export default RulesForm;

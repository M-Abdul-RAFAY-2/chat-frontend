
"use client";
import React, { useState, useEffect } from "react";
import { Save, Plus, Edit, Trash2, FileText, Copy } from "lucide-react";

interface Template {
  id: string;
  name: string;
  content: string;
  type: "whatsapp" | "sms" | "email" | "call";
  status: "active" | "inactive";
  category: string;
  createdAt: string;
  updatedAt: string;
}

const TemplatesForm = () => {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    type: "sms" as Template["type"],
    status: "active" as Template["status"],
    category: "",
  });

  useEffect(() => {
    const savedTemplates = localStorage.getItem("templates");
    if (savedTemplates) {
      setTemplates(JSON.parse(savedTemplates));
    }
  }, []);

  const saveTemplates = (newTemplates: Template[]) => {
    setTemplates(newTemplates);
    localStorage.setItem("templates", JSON.stringify(newTemplates));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTemplate) {
      const updatedTemplates = templates.map(template =>
        template.id === editingTemplate.id
          ? { ...template, ...formData, updatedAt: new Date().toISOString() }
          : template
      );
      saveTemplates(updatedTemplates);
    } else {
      const newTemplate: Template = {
        id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      saveTemplates([...templates, newTemplate]);
    }

    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: "",
      content: "",
      type: "sms",
      status: "active",
      category: "",
    });
    setIsFormOpen(false);
    setEditingTemplate(null);
  };

  const handleEdit = (template: Template) => {
    setFormData({
      name: template.name,
      content: template.content,
      type: template.type,
      status: template.status,
      category: template.category,
    });
    setEditingTemplate(template);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      const updatedTemplates = templates.filter(template => template.id !== id);
      saveTemplates(updatedTemplates);
    }
  };

  const handleCopyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    alert("Template content copied to clipboard!");
  };

  const getTypeIcon = (type: Template["type"]) => {
    switch (type) {
      case "sms": return "📱";
      case "email": return "📧";
      case "whatsapp": return "💬";
      case "call": return "📞";
      default: return "📱";
    }
  };

  const getStatusColor = (status: Template["status"]) => {
    return status === "active" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 sm:mb-0">
          <FileText className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-gray-900">Message Templates</h1>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Create Template</span>
        </button>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {editingTemplate ? "Edit Template" : "Create Template"}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter template name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value as Template["type"]})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="sms">SMS</option>
                      <option value="email">Email</option>
                      <option value="whatsapp">WhatsApp</option>
                      <option value="call">Call Script</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value as Template["status"]})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Category</option>
                      <option value="welcome">Welcome</option>
                      <option value="follow-up">Follow-up</option>
                      <option value="promotional">Promotional</option>
                      <option value="reminder">Reminder</option>
                      <option value="support">Support</option>
                      <option value="closing">Closing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content *
                  </label>
                  <textarea
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your template content here. You can use variables like {name}, {company}, etc."
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Tip: Use variables like {`{name}`}, {`{company}`}, {`{phone}`} for personalization
                  </p>
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
                    <span>{editingTemplate ? "Update" : "Create"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Templates List */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 truncate mb-1">{template.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(template.status)}`}>
                    {template.status}
                  </span>
                  <span className="text-sm">{getTypeIcon(template.type)}</span>
                  <span className="text-xs text-gray-500 capitalize">{template.type}</span>
                </div>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => handleCopyContent(template.content)}
                  className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                  title="Copy content"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleEdit(template)}
                  className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(template.id)}
                  className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            
            {template.category && (
              <p className="text-xs text-blue-600 mb-2 capitalize">
                📂 {template.category}
              </p>
            )}
            
            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-sm text-gray-700 line-clamp-4">{template.content}</p>
            </div>
            
            <p className="text-xs text-gray-500">
              Updated: {new Date(template.updatedAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div className="text-center py-12">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No templates created yet</h3>
          <p className="text-gray-500 mb-4">Create message templates to streamline your communication.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Template
          </button>
        </div>
      )}
    </div>
  );
};

export default TemplatesForm;

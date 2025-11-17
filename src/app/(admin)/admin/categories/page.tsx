"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Check, X, Loader2, AlertCircle } from "lucide-react";
import type { Category } from "@/server/repositories/categoriesRepository";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "all" as "stay" | "activity" | "trip" | "all",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/categories");
      if (res.ok) {
        const data = await res.json();
        setCategories(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const url = editingId ? `/api/categories/${editingId}` : "/api/categories";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to save category");
        return;
      }

      setSuccess(`Category ${editingId ? "updated" : "created"} successfully!`);
      setShowForm(false);
      setEditingId(null);
      setFormData({ name: "", type: "all", isActive: true });
      fetchCategories();
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category._id || null);
    setFormData({
      name: category.name,
      type: category.type,
      isActive: category.isActive,
    });
    setShowForm(true);
    setError("");
    setSuccess("");
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to delete category");
        return;
      }

      setSuccess("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      setError("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", type: "all", isActive: true });
    setError("");
    setSuccess("");
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      stay: "Stays",
      activity: "Activities",
      trip: "Getaways",
      all: "All Types",
    };
    return labels[type] || type;
  };

  return (
    <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Manage Categories
            </h2>
            <p className="text-gray-600">
              Add and manage categories for stays, activities, and getaways
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="flex items-center gap-2 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
            >
              <Plus size={20} />
              Add Category
            </button>
          )}
        </div>

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <Check className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">{success}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-800">{error}</span>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {editingId ? "Edit Category" : "Add New Category"}
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Luxury, Adventure"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent"
                  required
                >
                  <option value="all">All Types</option>
                  <option value="stay">Stays</option>
                  <option value="activity">Activities</option>
                  <option value="trip">Getaways</option>
                </select>
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 text-[#E51A4B] rounded focus:ring-[#E51A4B]"
                  />
                  <span className="text-sm font-semibold text-gray-700">Active</span>
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button
                type="submit"
                className="flex items-center gap-2 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                {editingId ? "Update" : "Create"} Category
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="animate-spin text-[#E51A4B]" size={32} />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No categories found.</p>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center gap-2 bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold py-2 px-4 rounded-lg transition-colors mx-auto"
              >
                <Plus size={20} />
                Add First Category
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Type</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-gray-900">{category.name}</td>
                    <td className="py-3 px-4 text-gray-600">{getTypeLabel(category.type)}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          category.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => category._id && handleDelete(category._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


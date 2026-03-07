"use client";

import { useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

interface TourPackageEnquiryFormProps {
  packageName: string;
  packagePrice?: number;
  currency?: string;
  destination?: string;
  /** Selected duration options (e.g. 3D/2N, 5D/4N) - submitted with enquiry */
  selectedDurationOptions?: string[];
  onSubmitSuccess?: () => void;
}

export function TourPackageEnquiryForm({
  packageName,
  packagePrice,
  currency = "INR",
  destination,
  selectedDurationOptions = [],
  onSubmitSuccess,
}: TourPackageEnquiryFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobileNumber: "",
    preferredTravelDate: "",
    numberOfTravelers: "",
    budget: "",
    departureCity: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.fullName.trim()) e.fullName = "Name is required";
    if (!formData.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) e.email = "Enter a valid email";
    if (!formData.mobileNumber.trim()) e.mobileNumber = "Contact number is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobileNumber: formData.mobileNumber.trim(),
          itemName: packageName,
          itemType: "tour-package",
          itemPrice: packagePrice != null ? String(packagePrice) : undefined,
          destination: destination || undefined,
          preferredTravelDate: formData.preferredTravelDate.trim() || undefined,
          numberOfTravelers: formData.numberOfTravelers.trim() ? Number(formData.numberOfTravelers) : undefined,
          budget: formData.budget.trim() || undefined,
          departureCity: formData.departureCity.trim() || undefined,
          selectedDurationOptions: selectedDurationOptions.length > 0 ? selectedDurationOptions : undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setSubmitted(true);
        setFormData({ fullName: "", email: "", mobileNumber: "", preferredTravelDate: "", numberOfTravelers: "", budget: "", departureCity: "" });
        onSubmitSuccess?.();
      } else if (data.errors) {
        setErrors(data.errors);
      } else {
        setErrors({ general: data.error || "Failed to submit" });
      }
    } catch {
      setErrors({ general: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
        <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
        <p className="text-green-800 font-medium">Thank you! We’ll get back to you soon.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.general && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
          <AlertCircle size={18} />
          {errors.general}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
        <input
          type="text"
          value={formData.fullName}
          onChange={(e) => handleChange("fullName", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
          placeholder="Your name"
        />
        {errors.fullName && <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email <span className="text-red-500">*</span></label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] ${errors.email ? "border-red-500" : "border-gray-300"}`}
          placeholder="your@email.com"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Contact number <span className="text-red-500">*</span></label>
        <input
          type="tel"
          value={formData.mobileNumber}
          onChange={(e) => handleChange("mobileNumber", e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] ${errors.mobileNumber ? "border-red-500" : "border-gray-300"}`}
          placeholder="e.g. +91 9876543210"
        />
        {errors.mobileNumber && <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Preferred travel date <span className="text-gray-400">(optional)</span></label>
        <input
          type="date"
          value={formData.preferredTravelDate}
          onChange={(e) => handleChange("preferredTravelDate", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B]"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of travelers <span className="text-gray-400">(optional)</span></label>
        <input
          type="number"
          min="1"
          value={formData.numberOfTravelers}
          onChange={(e) => handleChange("numberOfTravelers", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B]"
          placeholder="e.g. 2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Budget <span className="text-gray-400">(optional)</span></label>
        <input
          type="text"
          value={formData.budget}
          onChange={(e) => handleChange("budget", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B]"
          placeholder="e.g. 50,000 INR"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Departure city <span className="text-gray-400">(optional)</span></label>
        <input
          type="text"
          value={formData.departureCity}
          onChange={(e) => handleChange("departureCity", e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B]"
          placeholder="e.g. Bangalore"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#E51A4B] hover:bg-[#c91742] disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? <><Loader2 className="animate-spin" size={20} /> Sending...</> : "Send Enquiry"}
      </button>
    </form>
  );
}

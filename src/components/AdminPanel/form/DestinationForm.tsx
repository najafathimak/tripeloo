"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, CheckCircle, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface FormErrors {
  name?: string;
  slug?: string;
  location?: string;
  coverImage?: string;
  startingPrice?: string;
  summary?: string;
  tags?: string;
  general?: string;
}

interface FormData {
  name: string;
  slug: string;
  location: string;
  coverImage: string;
  startingPrice: string;
  currency: string;
  summary: string;
  tags: string[];
  carouselImages: string[];
  overviewHeading: string;
  overviewDescription: string;
}

interface DestinationFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function DestinationForm({ initialData, isEdit = false }: DestinationFormProps = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    slug: "",
    location: "",
    coverImage: "",
    startingPrice: "",
    currency: "INR",
    summary: "",
    tags: [],
    carouselImages: [],
    overviewHeading: "",
    overviewDescription: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [tagInput, setTagInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Populate form with initialData if editing
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        name: initialData.name || "",
        slug: initialData.slug || "",
        location: initialData.location || "",
        coverImage: initialData.coverImage || "",
        startingPrice: initialData.startingPrice?.toString() || "",
        currency: initialData.currency || "INR",
        summary: initialData.summary || "",
        tags: initialData.tags || [],
        carouselImages: initialData.carouselImages || [],
        overviewHeading: initialData.overviewHeading || "",
        overviewDescription: initialData.overviewDescription || "",
      });
      setImagePreview(initialData.coverImage || "");
    }
  }, [initialData, isEdit]);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData({ ...formData, name });
    // Auto-generate slug if slug is empty or matches previous name
    if (!formData.slug || formData.slug === generateSlug(formData.name)) {
      setFormData((prev) => ({ ...prev, name, slug: generateSlug(name) }));
    } else {
      setFormData({ ...formData, name });
    }
    if (errors.name) setErrors({ ...errors, name: undefined });
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const slug = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setFormData({ ...formData, slug });
    if (errors.slug) setErrors({ ...errors, slug: undefined });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        coverImage: "Please upload a valid image (JPEG, PNG, or WebP)",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      setErrors({
        ...errors,
        coverImage: "Image size must be less than 10MB",
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrors({ ...errors, coverImage: undefined });

    try {
      // Create FormData for upload
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      // Upload to Cloudinary via API
      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      setFormData({ ...formData, coverImage: data.url });
      setImagePreview(data.url);
      setUploadProgress(100);
    } catch (error: any) {
      setErrors({
        ...errors,
        coverImage: error.message || "Failed to upload image",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      });
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    });
  };

  const handleCarouselImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB");
      return;
    }

    try {
      setIsUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await response.json();
      const imageUrl = data.url || data.secure_url;

      if (index !== undefined) {
        const updatedImages = [...formData.carouselImages];
        updatedImages[index] = imageUrl;
        setFormData({ ...formData, carouselImages: updatedImages });
      } else {
        setFormData({
          ...formData,
          carouselImages: [...formData.carouselImages, imageUrl],
        });
      }
    } catch (error: any) {
      alert(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (e.target) e.target.value = "";
    }
  };

  const removeCarouselImage = (index: number) => {
    setFormData({
      ...formData,
      carouselImages: formData.carouselImages.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    // Client-side validation
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Destination name is required";
    }

    if (!formData.slug.trim()) {
      newErrors.slug = "Slug is required";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(formData.slug)) {
      newErrors.slug = "Slug must be lowercase alphanumeric with hyphens only";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.coverImage.trim()) {
      newErrors.coverImage = "Cover image is required";
    }

    if (!formData.startingPrice.trim()) {
      newErrors.startingPrice = "Starting price is required";
    } else if (isNaN(Number(formData.startingPrice)) || Number(formData.startingPrice) <= 0) {
      newErrors.startingPrice = "Starting price must be a positive number";
    }

    if (!formData.summary.trim()) {
      newErrors.summary = "Summary is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEdit && initialData?.id 
        ? `/api/admin/destinations/${initialData.id}`
        : "/api/destinations/create";
      const method = isEdit ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          slug: formData.slug.trim(),
          location: formData.location.trim(),
          coverImage: formData.coverImage.trim(),
          startingPrice: Number(formData.startingPrice),
          currency: formData.currency,
          summary: formData.summary.trim(),
          tags: formData.tags,
          carouselImages: formData.carouselImages.filter(img => img.trim() !== ""),
          overviewHeading: formData.overviewHeading.trim(),
          overviewDescription: formData.overviewDescription.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.error || `Failed to ${isEdit ? 'update' : 'create'} destination` });
        }
        setIsSubmitting(false);
        return;
      }

      // Success
      setSuccessMessage(`Destination ${isEdit ? 'updated' : 'created'} successfully!`);
      setIsSubmitting(false);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Redirect to list page after edit or create
      setTimeout(() => {
        router.push('/admin/destinations');
      }, 1500);
    } catch (error) {
      setErrors({
        general: "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Destination' : 'Add New Destination'}
        </h2>
        <p className="text-gray-600 mb-8">
          {isEdit ? 'Update the destination details below.' : 'Fill in the details below to add a new destination to the platform.'}
        </p>

        {/* Success Message */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        )}

        {/* General Error */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-800">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
              Destination Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleNameChange}
              placeholder="e.g., Wayanad, Goa, Munnar"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all ${
                errors.name ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Slug */}
          <div>
            <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
              Slug <span className="text-red-500">*</span>
              <span className="text-gray-500 font-normal text-xs ml-2">
                (Auto-generated from name, can be edited)
              </span>
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug}
              onChange={handleSlugChange}
              placeholder="e.g., wayanad, goa, munnar"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all font-mono text-sm ${
                errors.slug ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.slug && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.slug}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label htmlFor="location" className="block text-sm font-semibold text-gray-700 mb-2">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Wayanad, Kerala, India"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all ${
                errors.location ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.location}
              </p>
            )}
          </div>

          {/* Cover Image */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Cover Image <span className="text-red-500">*</span>
            </label>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="coverImage"
                />
                <label
                  htmlFor="coverImage"
                  className={`flex items-center gap-2 px-6 py-3 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
                    isUploading
                      ? "border-blue-400 bg-blue-50"
                      : errors.coverImage
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300 hover:border-[#E51A4B] hover:bg-gray-50"
                  }`}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="animate-spin text-blue-600" size={20} />
                      <span className="text-blue-700 font-medium">
                        Uploading... {uploadProgress}%
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-600" size={20} />
                      <span className="text-gray-700 font-medium">
                        {formData.coverImage ? "Change Image" : "Upload Image"}
                      </span>
                    </>
                  )}
                </label>
                {formData.coverImage && !isUploading && (
                  <span className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle size={16} />
                    Image uploaded
                  </span>
                )}
              </div>

              {imagePreview && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src={imagePreview}
                    alt="Cover preview"
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, coverImage: "" });
                      setImagePreview("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>
                </div>
              )}

              {errors.coverImage && (
                <p className="text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.coverImage}
                </p>
              )}
              <p className="text-xs text-gray-500">
                Supported formats: JPEG, PNG, WebP. Max size: 10MB
              </p>
            </div>
          </div>

          {/* Price and Currency */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="startingPrice" className="block text-sm font-semibold text-gray-700 mb-2">
                Starting Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="startingPrice"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
                placeholder="e.g., 3499"
                min="0"
                step="0.01"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all ${
                  errors.startingPrice ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startingPrice && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.startingPrice}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="currency" className="block text-sm font-semibold text-gray-700 mb-2">
                Currency <span className="text-gray-500 font-normal text-xs">(Optional)</span>
              </label>
              <select
                id="currency"
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label htmlFor="summary" className="block text-sm font-semibold text-gray-700 mb-2">
              Summary <span className="text-red-500">*</span>
            </label>
            <textarea
              id="summary"
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              placeholder="Brief description of the destination..."
              rows={4}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all resize-none ${
                errors.summary ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.summary}
              </p>
            )}
          </div>

          {/* Carousel Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Carousel Images <span className="text-gray-500 font-normal text-xs">(Optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-3">
              Upload multiple images for the destination carousel. These will be displayed on the destination detail page.
            </p>
            <div className="space-y-4">
              {formData.carouselImages.map((image, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <div className="relative w-full h-32 rounded overflow-hidden border border-gray-200">
                        <Image
                          src={optimizeCloudinaryUrl(image)}
                          alt={`Carousel ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between">
                      <div>
                        <p className="text-sm text-gray-600 mb-2">Image {index + 1}</p>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleCarouselImageUpload(e, index)}
                          className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-3 py-2"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCarouselImage(index)}
                        className="mt-2 text-red-600 hover:text-red-700 text-sm flex items-center gap-1"
                      >
                        <Trash2 size={14} />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = "image/*";
                  input.onchange = (e) => handleCarouselImageUpload(e as any);
                  input.click();
                }}
                className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-[#E51A4B] hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                <span className="text-gray-700 font-medium">Add Carousel Image</span>
              </button>
            </div>
          </div>

          {/* Overview Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Overview Section</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="overviewHeading" className="block text-sm font-semibold text-gray-700 mb-2">
                  Overview Heading <span className="text-gray-500 font-normal text-xs">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="overviewHeading"
                  name="overviewHeading"
                  value={formData.overviewHeading}
                  onChange={handleInputChange}
                  placeholder={`e.g., About ${formData.name || "Destination"}`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use default: &quot;About [destination name]&quot;
                </p>
              </div>
              <div>
                <label htmlFor="overviewDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                  Overview Description <span className="text-gray-500 font-normal text-xs">(Optional)</span>
                </label>
                <textarea
                  id="overviewDescription"
                  name="overviewDescription"
                  value={formData.overviewDescription}
                  onChange={handleInputChange}
                  placeholder="Detailed description about the destination..."
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave empty to use the summary text
                </p>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tags <span className="text-gray-500 font-normal text-xs">(Optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="Add a tag and press Enter"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent transition-all"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Add
              </button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#E51A4B]/10 text-[#E51A4B] rounded-full text-sm font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-700 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || isUploading}
              className="flex-1 bg-[#E51A4B] hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-4 px-8 rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  {isEdit ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                isEdit ? "Update Destination" : "Create Destination"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  slug: "",
                  location: "",
                  coverImage: "",
                  startingPrice: "",
                  currency: "INR",
                  summary: "",
                  tags: [],
                  carouselImages: [],
                  overviewHeading: "",
                  overviewDescription: "",
                });
                setImagePreview("");
                setErrors({});
                setSuccessMessage("");
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


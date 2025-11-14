"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, CheckCircle, AlertCircle, Loader2, Plus, Trash2 } from "lucide-react";
import Image from "next/image";

interface FormErrors {
  name?: string;
  destinationSlug?: string;
  category?: string;
  coverImage?: string;
  startingPrice?: string;
  summary?: string;
  general?: string;
}

interface Package {
  id: string;
  name: string;
  duration: string;
  price: string;
  thumb: string;
  images: string[];
  highlights: string[];
}

interface CarouselImage {
  url: string;
  title: string;
}

interface AdditionalDetail {
  id: string;
  heading: string;
  type: "description" | "points";
  description?: string;
  points?: string[];
}

interface FormData {
  name: string;
  propertyName: string;
  destinationSlug: string;
  category: string;
  coverImage: string;
  carouselImages: CarouselImage[];
  startingPrice: string;
  originalPrice: string;
  currency: string;
  summary: string;
  includes: string[];
  excludes: string[];
  properties: string[];
  packages: Package[];
  location: string;
  additionalDetails: AdditionalDetail[];
}

interface TripFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export default function TripForm({ initialData, isEdit = false }: TripFormProps = {}) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    propertyName: "",
    destinationSlug: "",
    category: "",
    coverImage: "",
    carouselImages: [],
    startingPrice: "",
    originalPrice: "",
    currency: "INR",
    summary: "",
    includes: [],
    excludes: [],
    properties: [],
    packages: [],
    location: "",
    additionalDetails: [],
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [successMessage, setSuccessMessage] = useState("");
  const [destinations, setDestinations] = useState<Array<{ slug: string; name: string }>>([]);
  const [loadingDestinations, setLoadingDestinations] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [includeInput, setIncludeInput] = useState("");
  const [excludeInput, setExcludeInput] = useState("");
  const [propertyInput, setPropertyInput] = useState("");
  const [pointInputs, setPointInputs] = useState<Record<string, string>>({});
  const [packageHighlightInputs, setPackageHighlightInputs] = useState<Record<string, string>>({});

  // Fetch destinations
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/destinations");
        if (res.ok) {
          const data = await res.json();
          setDestinations(data.data || []);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      } finally {
        setLoadingDestinations(false);
      }
    };
    fetchDestinations();
  }, []);

  // Populate form with initialData if editing
  useEffect(() => {
    if (initialData && isEdit) {
      setFormData({
        name: initialData.name || "",
        propertyName: initialData.propertyName || "",
        destinationSlug: initialData.destinationSlug || "",
        category: initialData.category || "",
        coverImage: initialData.coverImage || "",
        carouselImages: (initialData.carouselImages || []).map((img: any) => ({
          url: typeof img === 'string' ? img : img.url || "",
          title: typeof img === 'string' ? "" : img.title || "",
        })),
        startingPrice: initialData.startingPrice?.toString() || "",
        originalPrice: initialData.originalPrice?.toString() || "",
        currency: initialData.currency || "INR",
        summary: initialData.summary || "",
        includes: initialData.includes || [],
        excludes: initialData.excludes || [],
        properties: initialData.properties || [],
        packages: (initialData.packages || []).map((pkg: any, idx: number) => ({
          id: pkg.id || `pkg-${idx}`,
          name: pkg.name || "",
          duration: pkg.duration || "",
          price: pkg.price?.toString() || "",
          thumb: pkg.thumb || "",
          images: pkg.images || [],
          highlights: pkg.highlights || [],
        })),
        location: initialData.location || "",
        additionalDetails: (initialData.additionalDetails || []).map((detail: any, idx: number) => ({
          id: detail.id || `detail-${idx}`,
          heading: detail.heading || "",
          type: detail.type || "description",
          description: detail.description || "",
          points: detail.points || [],
        })),
      });
      setImagePreview(initialData.coverImage || "");
    }
  }, [initialData, isEdit]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name as keyof FormErrors]) {
      setErrors({ ...errors, [name]: undefined });
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isCarousel = false, index?: number, isPackage = false, packageIndex?: number, isPackageThumb = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setErrors({
        ...errors,
        coverImage: "Please upload a valid image (JPEG, PNG, or WebP)",
      });
      return;
    }

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
      
      if (isPackage && packageIndex !== undefined) {
        const updatedPackages = [...formData.packages];
        if (isPackageThumb) {
          updatedPackages[packageIndex] = { ...updatedPackages[packageIndex], thumb: data.url };
        } else {
          updatedPackages[packageIndex] = { 
            ...updatedPackages[packageIndex], 
            images: [...updatedPackages[packageIndex].images, data.url] 
          };
        }
        setFormData({ ...formData, packages: updatedPackages });
      } else if (isCarousel && index !== undefined) {
        const updatedCarousel = [...formData.carouselImages];
        updatedCarousel[index] = { ...updatedCarousel[index], url: data.url };
        setFormData({ ...formData, carouselImages: updatedCarousel });
      } else {
        setFormData({ ...formData, coverImage: data.url });
        setImagePreview(data.url);
      }
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

  const addCarouselImage = () => {
    setFormData({
      ...formData,
      carouselImages: [...formData.carouselImages, { url: "", title: "" }],
    });
  };

  const removeCarouselImage = (index: number) => {
    setFormData({
      ...formData,
      carouselImages: formData.carouselImages.filter((_, i) => i !== index),
    });
  };

  const updateCarouselImage = (index: number, field: "url" | "title", value: string) => {
    const updated = [...formData.carouselImages];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, carouselImages: updated });
  };

  const addInclude = () => {
    if (includeInput.trim() && !formData.includes.includes(includeInput.trim())) {
      setFormData({
        ...formData,
        includes: [...formData.includes, includeInput.trim()],
      });
      setIncludeInput("");
    }
  };

  const removeInclude = (index: number) => {
    setFormData({
      ...formData,
      includes: formData.includes.filter((_, i) => i !== index),
    });
  };

  const addExclude = () => {
    if (excludeInput.trim() && !formData.excludes.includes(excludeInput.trim())) {
      setFormData({
        ...formData,
        excludes: [...formData.excludes, excludeInput.trim()],
      });
      setExcludeInput("");
    }
  };

  const removeExclude = (index: number) => {
    setFormData({
      ...formData,
      excludes: formData.excludes.filter((_, i) => i !== index),
    });
  };

  const addProperty = () => {
    if (propertyInput.trim() && !formData.properties.includes(propertyInput.trim())) {
      setFormData({
        ...formData,
        properties: [...formData.properties, propertyInput.trim()],
      });
      setPropertyInput("");
    }
  };

  const removeProperty = (index: number) => {
    setFormData({
      ...formData,
      properties: formData.properties.filter((_, i) => i !== index),
    });
  };

  const addPackage = () => {
    setFormData({
      ...formData,
      packages: [
        ...formData.packages,
        {
          id: Date.now().toString(),
          name: "",
          duration: "",
          price: "",
          thumb: "",
          images: [],
          highlights: [],
        },
      ],
    });
  };

  const removePackage = (index: number) => {
    setFormData({
      ...formData,
      packages: formData.packages.filter((_, i) => i !== index),
    });
  };

  const updatePackage = (index: number, field: keyof Package, value: any) => {
    const updated = [...formData.packages];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, packages: updated });
  };

  const addPackageHighlight = (packageIndex: number) => {
    const pkg = formData.packages[packageIndex];
    const inputKey = pkg.id;
    const highlight = packageHighlightInputs[inputKey]?.trim();
    if (highlight && !pkg.highlights.includes(highlight)) {
      updatePackage(packageIndex, "highlights", [...pkg.highlights, highlight]);
      setPackageHighlightInputs({ ...packageHighlightInputs, [inputKey]: "" });
    }
  };

  const removePackageHighlight = (packageIndex: number, highlightIndex: number) => {
    const pkg = formData.packages[packageIndex];
    updatePackage(packageIndex, "highlights", pkg.highlights.filter((_, i) => i !== highlightIndex));
  };

  const addAdditionalDetail = () => {
    setFormData({
      ...formData,
      additionalDetails: [
        ...formData.additionalDetails,
        {
          id: Date.now().toString(),
          heading: "",
          type: "description",
          description: "",
          points: [],
        },
      ],
    });
  };

  const removeAdditionalDetail = (index: number) => {
    setFormData({
      ...formData,
      additionalDetails: formData.additionalDetails.filter((_, i) => i !== index),
    });
  };

  const updateAdditionalDetail = (index: number, field: keyof AdditionalDetail, value: any) => {
    const updated = [...formData.additionalDetails];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, additionalDetails: updated });
  };

  const setDetailType = (index: number, type: "description" | "points") => {
    setFormData((prevFormData) => {
      const detail = prevFormData.additionalDetails[index];
      if (detail.type === type) {
        return prevFormData;
      }
      
      const updated = [...prevFormData.additionalDetails];
      updated[index] = {
        ...updated[index],
        type: type,
        description: type === "description" ? (detail.description || "") : "",
        points: type === "points" ? (detail.points || []) : [],
      };
      
      if (type === "description") {
        const inputKey = detail.id;
        setPointInputs((prev) => {
          const newInputs = { ...prev };
          delete newInputs[inputKey];
          return newInputs;
        });
      }
      
      return { ...prevFormData, additionalDetails: updated };
    });
  };

  const addDetailPoint = (detailIndex: number) => {
    const detail = formData.additionalDetails[detailIndex];
    const inputKey = detail.id;
    const point = pointInputs[inputKey]?.trim();
    if (point) {
      updateAdditionalDetail(detailIndex, "points", [...(detail.points || []), point]);
      setPointInputs({ ...pointInputs, [inputKey]: "" });
    }
  };

  const removeDetailPoint = (detailIndex: number, pointIndex: number) => {
    const detail = formData.additionalDetails[detailIndex];
    updateAdditionalDetail(detailIndex, "points", detail.points?.filter((_, i) => i !== pointIndex) || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const newErrors: FormErrors = {};

    if (!formData.name.trim()) newErrors.name = "Trip name is required";
    if (!formData.destinationSlug) newErrors.destinationSlug = "Destination is required";
    if (!formData.category.trim()) newErrors.category = "Category is required";
    if (!formData.coverImage.trim()) newErrors.coverImage = "Cover image is required";
    if (!formData.startingPrice.trim()) newErrors.startingPrice = "Starting price is required";
    if (!formData.summary.trim()) newErrors.summary = "Summary is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const url = isEdit && initialData?.id 
        ? `/api/admin/trips/${initialData.id}`
        : "/api/trips/create";
      const method = isEdit ? "PUT" : "POST";
      
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          destinationSlug: formData.destinationSlug,
          category: formData.category.trim(),
          coverImage: formData.coverImage.trim(),
          carouselImages: formData.carouselImages,
          startingPrice: Number(formData.startingPrice),
          originalPrice: formData.originalPrice ? Number(formData.originalPrice) : null,
          currency: formData.currency,
          summary: formData.summary.trim(),
          includes: formData.includes,
          excludes: formData.excludes,
          properties: formData.properties,
          packages: formData.packages.map((pkg) => ({
            name: pkg.name?.trim() || '',
            duration: pkg.duration?.trim() || '',
            price: Number(pkg.price) || 0,
            thumb: pkg.thumb?.trim() || '',
            images: Array.isArray(pkg.images) ? pkg.images.filter((img: string) => img && img.trim()) : [],
            highlights: Array.isArray(pkg.highlights) ? pkg.highlights.filter((h: string) => h && h.trim()) : [],
          })),
          location: formData.location.trim(),
          propertyName: formData.propertyName.trim(),
          additionalDetails: formData.additionalDetails,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          setErrors({ general: data.error || `Failed to ${isEdit ? 'update' : 'create'} trip` });
        }
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage(`Trip ${isEdit ? 'updated' : 'created'} successfully!`);
      setIsSubmitting(false);
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      // Redirect to list page after edit or create
      setTimeout(() => {
        router.push('/admin/trips');
      }, 1500);
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {isEdit ? 'Edit Trip' : 'Add New Trip'}
        </h2>
        <p className="text-gray-600 mb-8">
          {isEdit ? 'Update the trip details below.' : 'Fill in the details below to add a new trip under a destination.'}
        </p>

        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="text-green-600" size={20} />
            <span className="text-green-800 font-medium">{successMessage}</span>
          </div>
        )}

        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="text-red-600" size={20} />
            <span className="text-red-800">{errors.general}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Trip Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Forest Camping Experience"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent ${
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

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Destination <span className="text-red-500">*</span>
              </label>
              <select
                name="destinationSlug"
                value={formData.destinationSlug}
                onChange={handleInputChange}
                disabled={loadingDestinations}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent ${
                  errors.destinationSlug ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Select Destination</option>
                {destinations.map((dest) => (
                  <option key={dest.slug} value={dest.slug}>
                    {dest.name}
                  </option>
                ))}
              </select>
              {errors.destinationSlug && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.destinationSlug}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent ${
                errors.category ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="">Select Category</option>
              <option value="Adventure">Adventure</option>
              <option value="Wildlife">Wildlife</option>
              <option value="Nature">Nature</option>
              <option value="Cultural">Cultural</option>
              <option value="Beach">Beach</option>
              <option value="Mountain">Mountain</option>
              <option value="General">General</option>
            </select>
            {errors.category && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.category}
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
                  onChange={(e) => handleImageUpload(e, false)}
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
                      <span className="text-blue-700 font-medium">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="text-gray-600" size={20} />
                      <span className="text-gray-700 font-medium">
                        {formData.coverImage ? "Change Image" : "Upload Cover Image"}
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
                  <Image src={imagePreview} alt="Cover preview" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, coverImage: "" });
                      setImagePreview("");
                      if (fileInputRef.current) fileInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
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
            </div>
          </div>

          {/* Carousel Images */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Carousel Images <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="space-y-4">
              {formData.carouselImages.map((img, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="grid md:grid-cols-2 gap-4 mb-2">
                    <div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, true, index)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      {img.url && (
                        <div className="mt-2 relative w-full h-32 rounded overflow-hidden">
                          <Image src={img.url} alt={`Carousel ${index + 1}`} fill className="object-cover" />
                        </div>
                      )}
                    </div>
                    <div>
                      <input
                        type="text"
                        placeholder="Image Title/Caption"
                        value={img.title}
                        onChange={(e) => updateCarouselImage(index, "title", e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
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
                onClick={addCarouselImage}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
              >
                <Plus size={16} />
                Add Carousel Image
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Starting Price <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="startingPrice"
                value={formData.startingPrice}
                onChange={handleInputChange}
                placeholder="e.g., 50000"
                min="0"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] ${
                  errors.startingPrice ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.startingPrice && (
                <p className="mt-1 text-sm text-red-600">{errors.startingPrice}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Original Price <span className="text-gray-500 text-xs">(Optional)</span>
              </label>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="e.g., 60000"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Currency
              </label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E51A4B]"
              >
                <option value="INR">INR (₹)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>

          {/* Summary */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Summary/Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="summary"
              value={formData.summary}
              onChange={handleInputChange}
              rows={4}
              placeholder="Describe the trip in detail..."
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-[#E51A4B] resize-none ${
                errors.summary ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.summary && (
              <p className="mt-1 text-sm text-red-600">{errors.summary}</p>
            )}
          </div>

          {/* Properties */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Trip Properties/Features <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={propertyInput}
                onChange={(e) => setPropertyInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addProperty();
                  }
                }}
                placeholder="e.g., Guided Tours"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addProperty}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <Plus size={16} />
              </button>
            </div>
            {formData.properties.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.properties.map((prop, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm"
                  >
                    {prop}
                    <button
                      type="button"
                      onClick={() => removeProperty(index)}
                      className="hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Includes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Includes <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={includeInput}
                onChange={(e) => setIncludeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addInclude();
                  }
                }}
                placeholder="e.g., Transfer Included"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addInclude}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <Plus size={16} />
              </button>
            </div>
            {formData.includes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.includes.map((inc, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-[#E51A4B]/10 text-[#E51A4B] rounded-full text-sm"
                  >
                    {inc}
                    <button
                      type="button"
                      onClick={() => removeInclude(index)}
                      className="hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Excludes */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Excludes <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={excludeInput}
                onChange={(e) => setExcludeInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addExclude();
                  }
                }}
                placeholder="e.g., Personal Expenses"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
              />
              <button
                type="button"
                onClick={addExclude}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
              >
                <Plus size={16} />
              </button>
            </div>
            {formData.excludes.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.excludes.map((exc, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm"
                  >
                    {exc}
                    <button
                      type="button"
                      onClick={() => removeExclude(index)}
                      className="hover:text-red-700"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Packages */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Packages <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Add different package options (e.g., 7 days, 5 days) with their own prices and highlights
            </p>
            <div className="space-y-6">
              {formData.packages.map((pkg, pkgIndex) => (
                <div key={pkg.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">Package {pkgIndex + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removePackage(pkgIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Package Name</label>
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) => updatePackage(pkgIndex, "name", e.target.value)}
                        placeholder="e.g., 7 Days Package"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Duration</label>
                      <input
                        type="text"
                        value={pkg.duration}
                        onChange={(e) => updatePackage(pkgIndex, "duration", e.target.value)}
                        placeholder="e.g., 7 days / 6 nights"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Price</label>
                      <input
                        type="number"
                        value={pkg.price}
                        onChange={(e) => updatePackage(pkgIndex, "price", e.target.value)}
                        placeholder="e.g., 50000"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Thumbnail Image</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, false, undefined, true, pkgIndex, true)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      {pkg.thumb && (
                        <div className="mt-2 relative w-full h-32 rounded overflow-hidden">
                          <Image src={pkg.thumb} alt="Package thumb" fill className="object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">Package Images</label>
                    <input
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp"
                      multiple
                      onChange={async (e) => {
                        const files = Array.from(e.target.files || []);
                        if (files.length === 0) return;

                        setIsUploading(true);
                        try {
                          const uploadedUrls: string[] = [];
                          
                          for (const file of files) {
                            const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
                            if (!allowedTypes.includes(file.type)) {
                              continue;
                            }

                            if (file.size > 10 * 1024 * 1024) {
                              continue;
                            }

                            const uploadFormData = new FormData();
                            uploadFormData.append("file", file);

                            const response = await fetch("/api/upload", {
                              method: "POST",
                              body: uploadFormData,
                            });

                            if (response.ok) {
                              const data = await response.json();
                              uploadedUrls.push(data.url);
                            }
                          }

                          if (uploadedUrls.length > 0) {
                            updatePackage(pkgIndex, "images", [...pkg.images, ...uploadedUrls]);
                          }
                        } catch (error) {
                          console.error("Error uploading package images:", error);
                        } finally {
                          setIsUploading(false);
                          // Reset input
                          e.target.value = "";
                        }
                      }}
                      disabled={isUploading}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    {isUploading && (
                      <p className="mt-1 text-xs text-blue-600 flex items-center gap-1">
                        <Loader2 className="animate-spin" size={12} />
                        Uploading images...
                      </p>
                    )}
                    {pkg.images.length > 0 && (
                      <div className="mt-2 grid grid-cols-3 gap-2">
                        {pkg.images.map((img, imgIndex) => (
                          <div key={imgIndex} className="relative h-24 rounded overflow-hidden border border-gray-200">
                            <Image src={img} alt={`Package ${pkgIndex + 1} image ${imgIndex + 1}`} fill className="object-cover" />
                            <button
                              type="button"
                              onClick={() => updatePackage(pkgIndex, "images", pkg.images.filter((_, i) => i !== imgIndex))}
                              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="mt-1 text-xs text-gray-500">
                      Upload multiple images for this package. They will be displayed in a carousel on the package card.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Highlights</label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={packageHighlightInputs[pkg.id] || ""}
                        onChange={(e) => setPackageHighlightInputs({ ...packageHighlightInputs, [pkg.id]: e.target.value })}
                        onKeyPress={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            addPackageHighlight(pkgIndex);
                          }
                        }}
                        placeholder="Enter highlight and press Enter"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        type="button"
                        onClick={() => addPackageHighlight(pkgIndex)}
                        className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    {pkg.highlights.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {pkg.highlights.map((highlight, highlightIndex) => (
                          <span
                            key={highlightIndex}
                            className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
                          >
                            {highlight}
                            <button
                              type="button"
                              onClick={() => removePackageHighlight(pkgIndex, highlightIndex)}
                              className="hover:text-red-700"
                            >
                              <X size={14} />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addPackage}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#E51A4B] hover:bg-[#E51A4B]/5 transition-all w-full justify-center"
              >
                <Plus size={20} />
                <span className="font-medium">Add Package</span>
              </button>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Location <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Wayanad, Kerala"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Property Name (Admin Only) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Property Name <span className="text-gray-500 text-xs">(Optional - Admin Only)</span>
            </label>
            <input
              type="text"
              name="propertyName"
              value={formData.propertyName}
              onChange={handleInputChange}
              placeholder="e.g., Trip ABC, Package XYZ (for admin identification)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg"
            />
            <p className="mt-1 text-xs text-gray-500">
              Internal property name for admin identification. Users will see the regular "Name" field.
            </p>
          </div>

          {/* Additional Details */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Additional Details <span className="text-gray-500 text-xs">(Optional)</span>
            </label>
            <p className="text-xs text-gray-500 mb-4">
              Add custom sections with headings and content (description or bullet points)
            </p>
            <div className="space-y-4">
              {formData.additionalDetails.map((detail, index) => (
                <div key={detail.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-gray-800">Detail Section {index + 1}</h4>
                    <button
                      type="button"
                      onClick={() => removeAdditionalDetail(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  {/* Heading */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">Heading</label>
                    <input
                      type="text"
                      value={detail.heading}
                      onChange={(e) => updateAdditionalDetail(index, "heading", e.target.value)}
                      placeholder="e.g., Cancellation Policy, Terms & Conditions"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>

                  {/* Type Toggle */}
                  <div className="mb-4">
                    <label className="block text-sm text-gray-600 mb-2">Content Type</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setDetailType(index, "description")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          detail.type === "description"
                            ? "bg-[#E51A4B] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Description
                      </button>
                      <button
                        type="button"
                        onClick={() => setDetailType(index, "points")}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          detail.type === "points"
                            ? "bg-[#E51A4B] text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                      >
                        Points
                      </button>
                    </div>
                  </div>

                  {/* Content based on type */}
                  {detail.type === "description" ? (
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Description</label>
                      <textarea
                        value={detail.description || ""}
                        onChange={(e) => updateAdditionalDetail(index, "description", e.target.value)}
                        placeholder="Enter description text..."
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block text-sm text-gray-600 mb-2">Points</label>
                      <div className="space-y-2 mb-2">
                        {detail.points?.map((point, pointIndex) => (
                          <div
                            key={pointIndex}
                            className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg"
                          >
                            <span className="text-[#E51A4B] font-bold">•</span>
                            <span className="flex-1 text-sm">{point}</span>
                            <button
                              type="button"
                              onClick={() => removeDetailPoint(index, pointIndex)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={pointInputs[detail.id] || ""}
                          onChange={(e) => setPointInputs({ ...pointInputs, [detail.id]: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              addDetailPoint(index);
                            }
                          }}
                          placeholder="Enter a point and press Enter"
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => addDetailPoint(index)}
                          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addAdditionalDetail}
                className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-[#E51A4B] hover:bg-[#E51A4B]/5 transition-all w-full justify-center"
              >
                <Plus size={20} />
                <span className="font-medium">Add Additional Detail Section</span>
              </button>
            </div>
          </div>

          {/* Submit */}
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
                isEdit ? "Update Trip" : "Create Trip"
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormData({
                  name: "",
                  propertyName: "",
                  destinationSlug: "",
                  category: "",
                  coverImage: "",
                  carouselImages: [],
                  startingPrice: "",
                  originalPrice: "",
                  currency: "INR",
                  summary: "",
                  includes: [],
                  excludes: [],
                  properties: [],
                  packages: [],
                  location: "",
                  additionalDetails: [],
                });
                setImagePreview("");
                setPointInputs({});
                setErrors({});
                setSuccessMessage("");
              }}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


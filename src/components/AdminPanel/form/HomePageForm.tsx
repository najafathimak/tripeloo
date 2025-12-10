"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, Loader2, Save, Trash2 } from "lucide-react";
import Image from "next/image";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface Testimonial {
  id: string;
  image: string;
  title: string;
  experience: string;
  name: string;
  location: string;
}

interface FormData {
  heroDesktopImage: string;
  heroMobileImage: string;
  discoverTitle: string;
  discoverContent: string;
  discoverButtonText: string;
  discoverButtonLink: string;
  testimonialsHeading: string;
  testimonials: Testimonial[];
}

export default function HomePageForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    heroDesktopImage: "",
    heroMobileImage: "",
    discoverTitle: "Discover India with Tripeloo",
    discoverContent: "",
    discoverButtonText: "hello@tripeloo.com",
    discoverButtonLink: "mailto:hello@tripeloo.com",
    testimonialsHeading: "Testimonials",
    testimonials: [],
  });

  const [uploading, setUploading] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [liveImages, setLiveImages] = useState<{ desktop: string; mobile: string }>({
    desktop: "",
    mobile: "",
  });

  useEffect(() => {
    fetchHomeData();
  }, []);

  const fetchHomeData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/home", { cache: 'no-store' });
      
      if (res.ok) {
        const data = await res.json();
        
        if (data.data) {
          // Store the original live images separately - use actual values, not empty strings
          const desktopImg = data.data.heroDesktopImage?.trim() || "";
          const mobileImg = data.data.heroMobileImage?.trim() || "";
          
          setLiveImages({
            desktop: desktopImg,
            mobile: mobileImg,
          });
          
          setFormData({
            heroDesktopImage: desktopImg,
            heroMobileImage: mobileImg,
            discoverTitle: data.data.discoverTitle || "Discover India with Tripeloo",
            discoverContent: data.data.discoverContent || "",
            discoverButtonText: data.data.discoverButtonText || "hello@tripeloo.com",
            discoverButtonLink: data.data.discoverButtonLink || "mailto:hello@tripeloo.com",
            testimonialsHeading: data.data.testimonialsHeading || "Testimonials",
            testimonials: data.data.testimonials || [],
          });
        }
      }
    } catch (error) {
      console.error("Error fetching home data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file: File, type: "desktop" | "mobile" | "testimonial", testimonialId?: string) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert("Image size should be less than 10MB");
      return;
    }

    try {
      const uploadKey = type === "testimonial" ? `testimonial-${testimonialId}` : type;
      setUploading(uploadKey);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const data = await res.json();
      const imageUrl = data.url || data.secure_url;
      
      if (!imageUrl) {
        throw new Error("No image URL returned from upload");
      }

      if (type === "desktop") {
        setFormData((prev) => ({ ...prev, heroDesktopImage: imageUrl }));
      } else if (type === "mobile") {
        setFormData((prev) => ({ ...prev, heroMobileImage: imageUrl }));
      } else if (type === "testimonial" && testimonialId) {
        setFormData((prev) => ({
          ...prev,
          testimonials: prev.testimonials.map((t) =>
            t.id === testimonialId ? { ...t, image: imageUrl } : t
          ),
        }));
      }
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to upload image";
      alert(errorMessage);
    } finally {
      setUploading(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      image: "",
      title: "",
      experience: "",
      name: "",
      location: "",
    };
    setFormData((prev) => ({
      ...prev,
      testimonials: [...prev.testimonials, newTestimonial],
    }));
  };

  const removeTestimonial = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.filter((t) => t.id !== id),
    }));
  };

  const updateTestimonial = (id: string, field: keyof Testimonial, value: string) => {
    setFormData((prev) => ({
      ...prev,
      testimonials: prev.testimonials.map((t) =>
        t.id === id ? { ...t, [field]: value } : t
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const newErrors: Record<string, string> = {};

    if (!formData.heroDesktopImage.trim()) {
      newErrors.heroDesktopImage = "Desktop hero image is required";
    }
    if (!formData.heroMobileImage.trim()) {
      newErrors.heroMobileImage = "Mobile hero image is required";
    }
    if (!formData.discoverTitle.trim()) {
      newErrors.discoverTitle = "Discover title is required";
    }
    if (!formData.discoverContent.trim()) {
      newErrors.discoverContent = "Discover content is required";
    }
    if (!formData.discoverButtonText.trim()) {
      newErrors.discoverButtonText = "Button text is required";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/home", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrors({ general: data.error || "Failed to update home page" });
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage("Home page updated successfully!");
      setIsSubmitting(false);
      
      // Update live images to reflect the new saved images
      setLiveImages({
        desktop: formData.heroDesktopImage,
        mobile: formData.heroMobileImage,
      });
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrors({ general: "An error occurred. Please try again." });
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E51A4B]" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Edit Home Page</h1>
        <p className="text-white/80 mt-1">Manage your home page content and images</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-green-500/20 border border-green-500/50 rounded-lg text-white">
          {successMessage}
        </div>
      )}

      {errors.general && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Hero Section Images - Edit Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-2">Hero Section Images</h2>
          <p className="text-sm text-white/60 mb-4">Upload images for desktop and mobile hero banners</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Desktop Hero Image */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Desktop Banner Image <span className="text-red-400">*</span>
              </label>
              
              {/* Current Uploaded Image */}
              {liveImages.desktop ? (
                <div className="mb-4 p-3 bg-white/5 border border-white/20 rounded-lg">
                  <p className="text-xs text-white/70 mb-2 font-medium">Currently Uploaded:</p>
                  <div className="relative w-full h-48 rounded-lg overflow-hidden border border-white/30">
                    <Image
                      src={optimizeCloudinaryUrl(liveImages.desktop)}
                      alt="Current Desktop Banner"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#E51A4B]/90 text-white px-2 py-1 text-xs font-semibold rounded">
                      CURRENT
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-300">No desktop banner image uploaded yet</p>
                </div>
              )}
              
              {/* Preview of new image if uploaded but not saved yet */}
              {formData.heroDesktopImage && formData.heroDesktopImage !== liveImages.desktop && (
                <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-300 mb-2 font-medium">New image ready (will replace current after saving):</p>
                  <div className="relative w-full h-32 rounded overflow-hidden border border-blue-400/50">
                    <Image
                      src={optimizeCloudinaryUrl(formData.heroDesktopImage)}
                      alt="New Desktop Banner Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, heroDesktopImage: liveImages.desktop }))}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      title="Cancel and keep current image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
              
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                <Upload className="w-8 h-8 text-white/60 mb-2" />
                <span className="text-sm text-white/80">
                  {uploading === "desktop" ? "Uploading..." : formData.heroDesktopImage && formData.heroDesktopImage !== liveImages.desktop ? "Replace Desktop Image" : "Upload Desktop Image"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "desktop");
                  }}
                  disabled={uploading === "desktop"}
                />
              </label>
              {errors.heroDesktopImage && (
                <p className="mt-1 text-sm text-red-400">{errors.heroDesktopImage}</p>
              )}
            </div>

            {/* Mobile Hero Image */}
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Mobile Banner Image <span className="text-red-400">*</span>
              </label>
              
              {/* Current Uploaded Image */}
              {liveImages.mobile ? (
                <div className="mb-4 p-3 bg-white/5 border border-white/20 rounded-lg">
                  <p className="text-xs text-white/70 mb-2 font-medium">Currently Uploaded:</p>
                  <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden border border-white/30">
                    <Image
                      src={optimizeCloudinaryUrl(liveImages.mobile)}
                      alt="Current Mobile Banner"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-[#E51A4B]/90 text-white px-2 py-1 text-xs font-semibold rounded">
                      CURRENT
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                  <p className="text-xs text-yellow-300">No mobile banner image uploaded yet</p>
                </div>
              )}
              
              {/* Preview of new image if uploaded but not saved yet */}
              {formData.heroMobileImage && formData.heroMobileImage !== liveImages.mobile && (
                <div className="mb-3 p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <p className="text-xs text-blue-300 mb-2 font-medium">New image ready (will replace current after saving):</p>
                  <div className="relative w-full aspect-[3/4] rounded overflow-hidden border border-blue-400/50">
                    <Image
                      src={optimizeCloudinaryUrl(formData.heroMobileImage)}
                      alt="New Mobile Banner Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, heroMobileImage: liveImages.mobile }))}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                      title="Cancel and keep current image"
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              )}
              
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                <Upload className="w-8 h-8 text-white/60 mb-2" />
                <span className="text-sm text-white/80">
                  {uploading === "mobile" ? "Uploading..." : formData.heroMobileImage && formData.heroMobileImage !== liveImages.mobile ? "Replace Mobile Image" : "Upload Mobile Image"}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleImageUpload(file, "mobile");
                  }}
                  disabled={uploading === "mobile"}
                />
              </label>
              {errors.heroMobileImage && (
                <p className="mt-1 text-sm text-red-400">{errors.heroMobileImage}</p>
              )}
            </div>
          </div>
        </div>

        {/* Discover Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4">Discover Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="discoverTitle"
                value={formData.discoverTitle}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B]"
                placeholder="Discover India with Tripeloo"
              />
              {errors.discoverTitle && (
                <p className="mt-1 text-sm text-red-400">{errors.discoverTitle}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-white mb-2">
                Content <span className="text-red-400">*</span>
              </label>
              <textarea
                name="discoverContent"
                value={formData.discoverContent}
                onChange={handleInputChange}
                rows={5}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B] resize-none"
                placeholder="Enter discover section content..."
              />
              {errors.discoverContent && (
                <p className="mt-1 text-sm text-red-400">{errors.discoverContent}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Button Text <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  name="discoverButtonText"
                  value={formData.discoverButtonText}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B]"
                  placeholder="hello@tripeloo.com"
                />
                {errors.discoverButtonText && (
                  <p className="mt-1 text-sm text-red-400">{errors.discoverButtonText}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Button Link
                </label>
                <input
                  type="text"
                  name="discoverButtonLink"
                  value={formData.discoverButtonLink}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B]"
                  placeholder="mailto:hello@tripeloo.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Testimonials Carousel</h2>
            <button
              type="button"
              onClick={addTestimonial}
              className="px-4 py-2 bg-[#E51A4B] text-white rounded-lg hover:bg-[#c91742] transition-colors flex items-center gap-2"
            >
              <Plus size={18} />
              Add Testimonial
            </button>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-white mb-2">
              Section Heading
            </label>
            <input
              type="text"
              name="testimonialsHeading"
              value={formData.testimonialsHeading}
              onChange={handleInputChange}
              className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B]"
              placeholder="Testimonials"
            />
          </div>

          <div className="space-y-6">
            {formData.testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">Testimonial {index + 1}</h3>
                  <button
                    type="button"
                    onClick={() => removeTestimonial(testimonial.id)}
                    className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Image */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Image
                    </label>
                    {testimonial.image ? (
                      <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/20 mb-2">
                        <Image
                          src={testimonial.image}
                          alt="Testimonial"
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => updateTestimonial(testimonial.id, "image", "")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : null}
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/30 rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                      <Upload className="w-6 h-6 text-white/60 mb-1" />
                      <span className="text-xs text-white/80">
                        {uploading === `testimonial-${testimonial.id}` ? "Uploading..." : "Upload Image"}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleImageUpload(file, "testimonial", testimonial.id);
                        }}
                        disabled={uploading === `testimonial-${testimonial.id}`}
                      />
                    </label>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Title
                    </label>
                    <input
                      type="text"
                      value={testimonial.title}
                      onChange={(e) => updateTestimonial(testimonial.id, "title", e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B]"
                      placeholder="e.g., Amazing Experience"
                    />
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Experience
                    </label>
                    <textarea
                      value={testimonial.experience}
                      onChange={(e) => updateTestimonial(testimonial.id, "experience", e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B] resize-none"
                      placeholder="Share your experience..."
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={testimonial.name}
                      onChange={(e) => updateTestimonial(testimonial.id, "name", e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B]"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-semibold text-white mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={testimonial.location}
                      onChange={(e) => updateTestimonial(testimonial.id, "location", e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#E51A4B]"
                      placeholder="Mumbai, India"
                    />
                  </div>
                </div>
              </div>
            ))}

            {formData.testimonials.length === 0 && (
              <div className="text-center py-8 text-white/60">
                <p>No testimonials added yet. Click "Add Testimonial" to get started.</p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-[#E51A4B] hover:bg-[#c91742] disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Updating...
              </>
            ) : (
              <>
                <Save size={20} />
                Update Home Page
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}


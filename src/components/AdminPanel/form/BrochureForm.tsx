"use client";

import { useState, useEffect, useRef } from "react";
import { Download, Loader2, FileText, Image as ImageIcon, MapPin, Hotel, Activity, Plane, Star, Check, Users, Hourglass, Clock1, Smartphone, PawPrint, BookA, Dot } from "lucide-react";
import Image from "next/image";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { optimizeCloudinaryUrl } from "@/utils/cloudinary";

interface Destination {
  id: string;
  name: string;
  slug: string;
}

interface AdditionalDetail {
  heading: string;
  type: "description" | "points";
  description?: string;
  points?: string[];
}

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  rating: number;
  review: string;
  createdAt: Date | string;
}

interface Item {
  id: string;
  name: string;
  category?: string;
  coverImage: string;
  carouselImages?: string[] | Array<{ url: string; title?: string }>;
  summary?: string;
  about?: string;
  startingPrice?: number;
  originalPrice?: number;
  price?: number;
  currency?: string;
  includes?: string[];
  excludes?: string[];
  location?: string;
  additionalDetails?: AdditionalDetail[];
  properties?: string[];
  rooms?: Array<{
    name: string;
    thumb?: string;
    images?: string[];
    features?: string[];
    rate?: string;
  }>;
  packages?: Array<{
    name: string;
    duration?: string;
    price?: number;
    thumb?: string;
    images?: string[];
    highlights?: string[];
  }>;
  activityDetails?: {
    ages?: string;
    duration?: string;
    startTime?: string;
    mobileTicket?: boolean;
    animalWelfare?: boolean;
    liveGuide?: boolean | string;
    maxGroupSize?: number;
  };
  destinationName?: string;
}

export default function BrochureForm() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [selectedDestination, setSelectedDestination] = useState("");
  const [itemType, setItemType] = useState<"stay" | "activity" | "trip">("stay");
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [customContent, setCustomContent] = useState("");
  const [customPrice, setCustomPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [generatingPDF, setGeneratingPDF] = useState(false);
  const [selectedRooms, setSelectedRooms] = useState<string[]>([]); // Array of room names/indices
  const [selectedPackages, setSelectedPackages] = useState<string[]>([]); // Array of package names/indices
  const previewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await fetch("/api/admin/destinations");
        const data = await res.json();
        if (data.data) {
          setDestinations(data.data);
        }
      } catch (error) {
        console.error("Error fetching destinations:", error);
      }
    };
    fetchDestinations();
  }, []);

  useEffect(() => {
    if (!selectedDestination) {
      setItems([]);
      setSelectedItem(null);
      return;
    }

    const fetchItems = async () => {
      setLoadingItems(true);
      try {
        const destinationSlug = destinations.find((d) => d.id === selectedDestination)?.slug || selectedDestination;
        let endpoint = "";
        if (itemType === "stay") {
          endpoint = `/api/stays?destination=${encodeURIComponent(destinationSlug)}`;
        } else if (itemType === "activity") {
          endpoint = `/api/activities?destination=${encodeURIComponent(destinationSlug)}`;
        } else {
          endpoint = `/api/trips?destination=${encodeURIComponent(destinationSlug)}`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();
        if (data.data && Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      } finally {
        setLoadingItems(false);
      }
    };

    fetchItems();
  }, [selectedDestination, itemType, destinations]);

  useEffect(() => {
    if (!selectedItemId) {
      setSelectedItem(null);
      return;
    }

    const fetchItemDetails = async () => {
      setLoading(true);
      try {
        let endpoint = "";
        if (itemType === "stay") {
          endpoint = `/api/stays/${encodeURIComponent(selectedItemId)}`;
        } else if (itemType === "activity") {
          endpoint = `/api/activities/${encodeURIComponent(selectedItemId)}`;
        } else {
          endpoint = `/api/trips/${encodeURIComponent(selectedItemId)}`;
        }

        const res = await fetch(endpoint);
        const data = await res.json();
        
        if (data.data) {
          const normalizedItem = {
            ...data.data,
            carouselImages: Array.isArray(data.data.carouselImages)
              ? data.data.carouselImages.map((img: any) => 
                  typeof img === 'string' ? img : img.url || img
                ).filter((img: string) => img && img.trim() !== "")
              : [],
          };
          setSelectedItem(normalizedItem);
        } else {
          setSelectedItem(null);
        }
      } catch (error) {
        console.error("Error fetching item details:", error);
        const item = items.find((i) => i.id === selectedItemId);
        setSelectedItem(item || null);
      } finally {
        setLoading(false);
      }
    };

    fetchItemDetails();
  }, [selectedItemId, itemType, items]);

  // Reset room/package selections when item changes
  useEffect(() => {
    setSelectedRooms([]);
    setSelectedPackages([]);
  }, [selectedItemId]);

  useEffect(() => {
    if (!selectedItemId || !itemType) {
      setReviews([]);
      return;
    }

    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const res = await fetch(`/api/reviews?itemId=${encodeURIComponent(selectedItemId)}&itemType=${itemType}`);
        if (res.ok) {
          const data = await res.json();
          const reviewsData = (data.data || []).slice(0, 4);
          setReviews(reviewsData);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setReviews([]);
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, [selectedItemId, itemType]);

  const handleGeneratePDF = async () => {
    if (!previewRef.current || !selectedItem) return;

    setGeneratingPDF(true);
    try {
      // Create a clean container for PDF generation
      const pdfContainer = document.createElement("div");
      pdfContainer.style.width = "210mm";
      pdfContainer.style.padding = "20mm";
      pdfContainer.style.backgroundColor = "#ffffff";
      pdfContainer.style.fontFamily = "Arial, sans-serif";
      pdfContainer.style.color = "#000000";
      pdfContainer.style.position = "absolute";
      pdfContainer.style.left = "-9999px";
      pdfContainer.style.top = "0";
      pdfContainer.style.zIndex = "-1";
      document.body.appendChild(pdfContainer);

      // Clone the preview content
      const clonedContent = previewRef.current.cloneNode(true) as HTMLElement;
      
      // Remove any existing styles that might interfere
      clonedContent.removeAttribute("style");
      clonedContent.style.maxHeight = "none";
      clonedContent.style.overflow = "visible";
      clonedContent.style.width = "100%";
      clonedContent.style.backgroundColor = "#ffffff";
      clonedContent.style.color = "#000000";
      
      // Remove scroll-related classes and styles
      clonedContent.classList.remove("max-h-[80vh]", "overflow-y-auto");
      
      // Create comprehensive stylesheet to fix all styling issues
      const style = document.createElement("style");
      style.textContent = `
        * { 
          box-sizing: border-box !important;
        }
        body, html {
          margin: 0 !important;
          padding: 0 !important;
        }
        img { 
          max-width: 100% !important; 
          height: auto !important; 
          display: block !important;
          page-break-inside: avoid !important;
        }
        .text-white { color: #000 !important; }
        .text-gray-900 { color: #000 !important; }
        .text-gray-800 { color: #000 !important; }
        .text-gray-700 { color: #333 !important; }
        .text-gray-600 { color: #666 !important; }
        .text-gray-500 { color: #888 !important; }
        .text-gray-400 { color: #999 !important; }
        .bg-white { background: #fff !important; }
        .bg-gray-50 { background: #f9f9f9 !important; }
        .bg-gray-100 { background: #f5f5f5 !important; }
        .bg-gray-200 { background: #eee !important; }
        .bg-gray-800, .bg-gray-700 { background: #f5f5f5 !important; }
        .bg-red-50 { background: #fef2f2 !important; }
        .border-gray-200 { border-color: #ddd !important; }
        .border-gray-600 { border-color: #999 !important; }
        .text-[#E51A4B] { color: #E51A4B !important; }
        .text-emerald-600 { color: #059669 !important; }
        .text-green-600 { color: #16a34a !important; }
        div, p, span, h1, h2, h3, h4, h5, h6 {
          page-break-inside: avoid !important;
        }
      `;
      
      // Insert style at the beginning
      clonedContent.insertBefore(style, clonedContent.firstChild);
      
      // Append to container
      pdfContainer.appendChild(clonedContent);

      // Wait for images to load and styles to apply
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate canvas with better settings
      const canvas = await html2canvas(pdfContainer, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        allowTaint: false,
        imageTimeout: 15000,
        removeContainer: false,
        windowWidth: pdfContainer.scrollWidth,
        windowHeight: pdfContainer.scrollHeight,
      });

      const imgData = canvas.toDataURL("image/png", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // Clean up
      document.body.removeChild(pdfContainer);
      
      const fileName = selectedItem
        ? `${selectedItem.name.replace(/[^a-z0-9]/gi, "_")}_brochure.pdf`
        : "brochure.pdf";
      pdf.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setGeneratingPDF(false);
    }
  };

  return (
    <div className="container mx-auto p-4 text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
          <FileText className="w-8 h-8" />
          Brochure Generator
        </h1>
        <p className="text-white/80">Create and download PDF brochures for stays, activities, and trips</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Select Item</h2>

          {/* Destination Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/90 mb-2">
              Destination <span className="text-red-400">*</span>
            </label>
            <select
              value={selectedDestination}
              onChange={(e) => {
                setSelectedDestination(e.target.value);
                setSelectedItemId("");
                setSelectedItem(null);
              }}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent"
            >
              <option value="">Select Destination</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
          </div>

          {/* Item Type Selection */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/90 mb-2">
              Item Type <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  setItemType("stay");
                  setSelectedItemId("");
                  setSelectedItem(null);
                }}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  itemType === "stay"
                    ? "bg-[#E51A4B] border-[#E51A4B] text-white"
                    : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                <Hotel size={18} />
                <span className="text-sm font-medium">Stays</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setItemType("activity");
                  setSelectedItemId("");
                  setSelectedItem(null);
                }}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  itemType === "activity"
                    ? "bg-[#E51A4B] border-[#E51A4B] text-white"
                    : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                <Activity size={18} />
                <span className="text-sm font-medium">Activities</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setItemType("trip");
                  setSelectedItemId("");
                  setSelectedItem(null);
                }}
                className={`p-3 rounded-lg border transition-all flex items-center justify-center gap-2 ${
                  itemType === "trip"
                    ? "bg-[#E51A4B] border-[#E51A4B] text-white"
                    : "bg-gray-800 border-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                <Plane size={18} />
                <span className="text-sm font-medium">Getaways</span>
              </button>
            </div>
          </div>

          {/* Item Selection */}
          {selectedDestination && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Select {itemType === "stay" ? "Stay" : itemType === "activity" ? "Activity" : "Trip"}{" "}
                <span className="text-red-400">*</span>
              </label>
              {loadingItems ? (
                <div className="flex items-center justify-center p-4">
                  <Loader2 className="animate-spin text-[#E51A4B]" size={24} />
                </div>
              ) : (
                <select
                  value={selectedItemId}
                  onChange={(e) => setSelectedItemId(e.target.value)}
                  className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent"
                >
                  <option value="">Select {itemType === "stay" ? "Stay" : itemType === "activity" ? "Activity" : "Trip"}</option>
                  {items.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))}
                </select>
              )}
              {items.length === 0 && !loadingItems && selectedDestination && (
                <p className="text-white/60 text-sm mt-2">No items found for this destination</p>
              )}
            </div>
          )}

          {/* Room Selection (for Stays) */}
          {selectedItem && itemType === "stay" && selectedItem.rooms && selectedItem.rooms.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Select Rooms to Include (Optional - Leave empty to include all)
              </label>
              <div className="max-h-40 overflow-y-auto bg-gray-800 rounded-lg p-3 border border-gray-600">
                {selectedItem.rooms.map((room: any, idx: number) => {
                  const roomKey = room.name || `room-${idx}`;
                  const isSelected = selectedRooms.includes(roomKey);
                  return (
                    <label key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRooms([...selectedRooms, roomKey]);
                          } else {
                            setSelectedRooms(selectedRooms.filter((r) => r !== roomKey));
                          }
                        }}
                        className="w-4 h-4 text-[#E51A4B] bg-gray-700 border-gray-600 rounded focus:ring-[#E51A4B]"
                      />
                      <span className="text-sm text-white/90">{room.name || `Room ${idx + 1}`}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-white/60 mt-1">
                {selectedRooms.length === 0 
                  ? "All rooms will be included in the brochure" 
                  : `${selectedRooms.length} room(s) selected`}
              </p>
            </div>
          )}

          {/* Package Selection (for Getaways) */}
          {selectedItem && itemType === "trip" && selectedItem.packages && selectedItem.packages.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-white/90 mb-2">
                Select Packages to Include (Optional - Leave empty to include all)
              </label>
              <div className="max-h-40 overflow-y-auto bg-gray-800 rounded-lg p-3 border border-gray-600">
                {selectedItem.packages.map((pkg: any, idx: number) => {
                  const pkgKey = pkg.name || `package-${idx}`;
                  const isSelected = selectedPackages.includes(pkgKey);
                  return (
                    <label key={idx} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedPackages([...selectedPackages, pkgKey]);
                          } else {
                            setSelectedPackages(selectedPackages.filter((p) => p !== pkgKey));
                          }
                        }}
                        className="w-4 h-4 text-[#E51A4B] bg-gray-700 border-gray-600 rounded focus:ring-[#E51A4B]"
                      />
                      <span className="text-sm text-white/90">{pkg.name || `Package ${idx + 1}`}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-white/60 mt-1">
                {selectedPackages.length === 0 
                  ? "All packages will be included in the brochure" 
                  : `${selectedPackages.length} package(s) selected`}
              </p>
            </div>
          )}

          {/* Custom Price */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/90 mb-2">
              Custom Price (Optional)
            </label>
            <input
              type="text"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
              placeholder="e.g., ₹5,000 / night or Starting from ₹10,000"
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent"
            />
            <p className="text-xs text-white/60 mt-1">This will override the default price display</p>
          </div>

          {/* Custom Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-white/90 mb-2">
              Custom Content (Optional)
            </label>
            <textarea
              value={customContent}
              onChange={(e) => setCustomContent(e.target.value)}
              placeholder="Enter custom content, special offers, terms & conditions, contact information, etc."
              rows={6}
              className="w-full p-3 rounded-lg bg-gray-800 border border-gray-600 text-white focus:ring-2 focus:ring-[#E51A4B] focus:border-transparent resize-none"
            />
          </div>

          {/* Download Button */}
          {selectedItem && (
            <button
              onClick={handleGeneratePDF}
              disabled={generatingPDF}
              className="w-full bg-[#E51A4B] hover:bg-[#c91742] text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {generatingPDF ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download Brochure PDF
                </>
              )}
            </button>
          )}
        </div>

        {/* Preview Section */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <h2 className="text-xl font-semibold mb-4">Preview</h2>
          
          {loading ? (
            <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
              <Loader2 className="animate-spin text-[#E51A4B] mx-auto mb-4" size={32} />
              <p className="text-white/60">Loading item details...</p>
            </div>
          ) : selectedItem ? (
            <div
              ref={previewRef}
              className="bg-white text-gray-900 rounded-lg p-6 shadow-lg max-h-[80vh] overflow-y-auto"
            >
              {/* Logo at Top Middle */}
              <div className="flex justify-center mb-6">
                <Image
                  src="/assets/logo_new.png"
                  alt="Tripeloo Logo"
                  width={200}
                  height={80}
                  className="h-16 w-auto object-contain"
                />
              </div>

              {/* Carousel - Cover Image + All Carousel Images */}
              <div className="mb-6">
                {selectedItem.coverImage && (
                  <Image
                    src={optimizeCloudinaryUrl(selectedItem.coverImage)}
                    alt={selectedItem.name}
                    width={800}
                    height={400}
                    className="w-full h-80 object-cover rounded-lg mb-4"
                  />
                )}
                {selectedItem.carouselImages && 
                 Array.isArray(selectedItem.carouselImages) && 
                 selectedItem.carouselImages.filter((img: any) => {
                   const imgUrl = typeof img === 'string' ? img : img?.url || '';
                   return imgUrl && imgUrl.trim() !== "";
                 }).length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedItem.carouselImages
                      .filter((img: any) => {
                        const imgUrl = typeof img === 'string' ? img : img?.url || '';
                        return imgUrl && imgUrl.trim() !== "";
                      })
                      .map((img: any, idx: number) => {
                        const imgUrl = typeof img === 'string' ? img : img?.url || '';
                        return (
                          <Image
                            key={idx}
                            src={optimizeCloudinaryUrl(imgUrl)}
                            alt={`${selectedItem.name} - Image ${idx + 1}`}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover rounded-lg"
                          />
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-snug mb-4">
                {selectedItem.name}
              </h1>

              {/* Rating */}
              <div className="mb-4">
                <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-3">
                  <div className="flex items-center gap-1 text-emerald-600 font-medium">
                    <Star className="w-4 h-4 fill-emerald-500" />
                    <span>5.0</span>
                  </div>
                  <span className="text-sm">(Reviews)</span>
                </div>
                {/* Custom Price Only - No DB Prices */}
                {customPrice && (
                  <div className="flex items-center gap-3 mt-3">
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{customPrice}</p>
                  </div>
                )}
              </div>

              {/* Summary (for Stays/Getaways) */}
              {selectedItem.summary && itemType !== "activity" && (
                <p className="mt-4 mb-6 text-gray-600 text-sm sm:text-base">
                  {selectedItem.summary}
                </p>
              )}

              {/* About (for Activities) */}
              {selectedItem.about && itemType === "activity" && (
                <div className="mt-8 mb-6 bg-red-50 px-3 py-3 border rounded-lg">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">About</h2>
                  <p className="text-gray-700">{selectedItem.about}</p>
                </div>
              )}

              {/* Old Style Includes - After Description (for Stays/Getaways) */}
              {selectedItem.includes && Array.isArray(selectedItem.includes) && selectedItem.includes.length > 0 && itemType !== "activity" && (
                <div className="mt-6 mb-6 flex flex-wrap gap-4 sm:gap-6 border-y py-4 text-gray-700 text-sm sm:text-base">
                  {selectedItem.includes.map((include: string, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-green-600">✓</span>
                      <span>{include}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Activity Details (for Activities) - Inline with Icons */}
              {selectedItem.activityDetails && Object.keys(selectedItem.activityDetails).length > 0 && itemType === "activity" && (
                <div className="mt-6 mb-6 px-4 flex flex-col gap-4 sm:gap-6 border-y py-4 text-gray-700 text-sm sm:text-base">
                  {selectedItem.activityDetails.ages && (
                    <div className="flex items-center gap-2">
                      <Users size={18} /> <span>{selectedItem.activityDetails.ages}</span>
                    </div>
                  )}
                  {selectedItem.activityDetails.duration && (
                    <div className="flex items-center gap-2">
                      <Hourglass size={18} /> <span>Duration: {selectedItem.activityDetails.duration}</span>
                    </div>
                  )}
                  {selectedItem.activityDetails.startTime && (
                    <div className="flex items-center gap-2">
                      <Clock1 size={18} /> <span>Start time: {selectedItem.activityDetails.startTime}</span>
                    </div>
                  )}
                  {selectedItem.activityDetails.mobileTicket && (
                    <div className="flex items-center gap-2">
                      <Smartphone size={18} /> <span>Mobile ticket</span>
                    </div>
                  )}
                  {selectedItem.activityDetails.animalWelfare && (
                    <div className="flex items-center gap-2">
                      <PawPrint size={18} /> <span>Meets animal welfare guidelines</span>
                    </div>
                  )}
                  {selectedItem.activityDetails.liveGuide && (
                    <div className="flex items-center gap-2">
                      <BookA size={18} /> <span>Live guide: {selectedItem.activityDetails.liveGuide}</span>
                    </div>
                  )}
                  {selectedItem.activityDetails.maxGroupSize && (
                    <div className="flex items-center gap-2">
                      <Users size={18} /> <span>Max Group Size: {selectedItem.activityDetails.maxGroupSize}</span>
                    </div>
                  )}
                </div>
              )}

              {/* IncludeItemSection (for Activities) */}
              {itemType === "activity" && (
                <div className="mb-6">
                  <section className="bg-red-50 py-7 px-6 md:px-5 rounded-lg">
                    {selectedItem.includes && Array.isArray(selectedItem.includes) && selectedItem.includes.length > 0 && (
                      <div className={selectedItem.excludes && selectedItem.excludes.length > 0 ? "mb-10" : ""}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">What Includes</h2>
                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
                          {selectedItem.includes.map((item: string, index: number) => (
                            <div key={index} className="flex items-start gap-2">
                              <Dot size={20} className="text-red-500" />
                              <p className="text-sm text-gray-700 leading-snug">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedItem.excludes && Array.isArray(selectedItem.excludes) && selectedItem.excludes.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">What Excludes</h2>
                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
                          {selectedItem.excludes.map((item: string, index: number) => (
                            <div key={index} className="flex items-start gap-3">
                              <Dot size={20} className="text-red-500 mt-1 shrink-0" />
                              <p className="text-sm text-gray-700 leading-snug">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* Resort Properties (for Stays) */}
              {selectedItem.properties && Array.isArray(selectedItem.properties) && selectedItem.properties.length > 0 && itemType === "stay" && (
                <div className="mt-8 mb-6 bg-red-50 rounded-2xl p-5 sm:p-6 shadow-inner">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Resort Properties</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
                    {selectedItem.properties.map((property: string, index: number) => (
                      <div key={index}>{property}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Getaway Features (for Getaways) */}
              {selectedItem.properties && Array.isArray(selectedItem.properties) && selectedItem.properties.length > 0 && itemType === "trip" && (
                <div className="mt-8 mb-6 bg-red-50 rounded-2xl p-5 sm:p-6 shadow-inner">
                  <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-900">Getaway Features</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 text-gray-700 text-sm sm:text-base">
                    {selectedItem.properties.map((prop: string, index: number) => (
                      <div key={index}>{prop}</div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rooms Section (for Stays) */}
              {selectedItem.rooms && Array.isArray(selectedItem.rooms) && selectedItem.rooms.length > 0 && itemType === "stay" && (() => {
                // Filter rooms based on selection
                const roomsToShow = selectedRooms.length > 0
                  ? selectedItem.rooms.filter((room: any, idx: number) => {
                      const roomKey = room.name || `room-${idx}`;
                      return selectedRooms.includes(roomKey);
                    })
                  : selectedItem.rooms;
                
                if (roomsToShow.length === 0) return null;
                
                return (
                  <div className="mb-6 mt-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Choose Your Room</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                      {roomsToShow.map((room: any, idx: number) => (
                      <div key={idx} className="cursor-pointer rounded-xl overflow-hidden shadow-md border border-gray-200">
                        {room.thumb ? (
                          <Image
                            src={optimizeCloudinaryUrl(room.thumb)}
                            alt={room.name}
                            width={180}
                            height={120}
                            className="h-[120px] w-full object-cover"
                          />
                        ) : room.images && room.images.length > 0 ? (
                          <Image
                            src={optimizeCloudinaryUrl(room.images[0])}
                            alt={room.name}
                            width={180}
                            height={120}
                            className="h-[120px] w-full object-cover"
                          />
                        ) : (
                          <div className="h-[120px] w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                        <div className="p-3 flex flex-col gap-1">
                          <h3 className="font-semibold text-sm text-gray-800">{room.name}</h3>
                          {/* Room rate excluded - only show if custom price is set globally */}
                        </div>
                        {/* Room Images Gallery */}
                        {room.images && Array.isArray(room.images) && room.images.filter((img: string) => img && img.trim() !== "").length > 0 && (
                          <div className="p-3 pt-0">
                            <div className="grid grid-cols-2 gap-2">
                              {room.images
                                .filter((img: string) => img && img.trim() !== "")
                                .slice(0, 4)
                                .map((img: string, imgIdx: number) => (
                                  <Image
                                    key={imgIdx}
                                    src={optimizeCloudinaryUrl(img)}
                                    alt={`${room.name} - Image ${imgIdx + 1}`}
                                    width={150}
                                    height={100}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                ))}
                            </div>
                            {room.images.filter((img: string) => img && img.trim() !== "").length > 4 && (
                              <p className="text-xs text-gray-500 mt-2">
                                +{room.images.filter((img: string) => img && img.trim() !== "").length - 4} more images
                              </p>
                            )}
                          </div>
                        )}
                        {/* Room Features */}
                        {room.features && Array.isArray(room.features) && room.features.length > 0 && (
                          <div className="p-3 pt-0">
                            <div className="grid grid-cols-2 gap-2 text-gray-700 text-xs">
                              {room.features.map((feature: string, fIdx: number) => (
                                <div key={fIdx}>• {feature}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Packages Section (for Getaways) */}
              {selectedItem.packages && Array.isArray(selectedItem.packages) && selectedItem.packages.length > 0 && itemType === "trip" && (() => {
                // Filter packages based on selection
                const packagesToShow = selectedPackages.length > 0
                  ? selectedItem.packages.filter((pkg: any, idx: number) => {
                      const pkgKey = pkg.name || `package-${idx}`;
                      return selectedPackages.includes(pkgKey);
                    })
                  : selectedItem.packages;
                
                if (packagesToShow.length === 0) return null;
                
                return (
                  <div className="mb-6 mt-8">
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Choose Your Package</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                      {packagesToShow.map((pkg: any, idx: number) => (
                      <div key={idx} className="cursor-pointer rounded-xl overflow-hidden shadow-md border border-gray-200">
                        {pkg.thumb ? (
                          <Image
                            src={optimizeCloudinaryUrl(pkg.thumb)}
                            alt={pkg.name}
                            width={180}
                            height={120}
                            className="h-[120px] w-full object-cover"
                          />
                        ) : pkg.images && pkg.images.length > 0 ? (
                          <Image
                            src={optimizeCloudinaryUrl(pkg.images[0])}
                            alt={pkg.name}
                            width={180}
                            height={120}
                            className="h-[120px] w-full object-cover"
                          />
                        ) : (
                          <div className="h-[120px] w-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-400 text-sm">No Image</span>
                          </div>
                        )}
                        <div className="p-3 flex flex-col gap-1">
                          <h3 className="font-semibold text-sm text-gray-800">{pkg.name}</h3>
                          {pkg.duration && (
                            <p className="text-xs text-gray-600">{pkg.duration}</p>
                          )}
                          {/* Package price excluded - only show if custom price is set globally */}
                        </div>
                        {/* Package Images Gallery */}
                        {pkg.images && Array.isArray(pkg.images) && pkg.images.filter((img: string) => img && img.trim() !== "").length > 0 && (
                          <div className="p-3 pt-0">
                            <div className="grid grid-cols-2 gap-2">
                              {pkg.images
                                .filter((img: string) => img && img.trim() !== "")
                                .slice(0, 4)
                                .map((img: string, imgIdx: number) => (
                                  <Image
                                    key={imgIdx}
                                    src={optimizeCloudinaryUrl(img)}
                                    alt={`${pkg.name} - Image ${imgIdx + 1}`}
                                    width={150}
                                    height={100}
                                    className="w-full h-20 object-cover rounded"
                                  />
                                ))}
                            </div>
                            {pkg.images.filter((img: string) => img && img.trim() !== "").length > 4 && (
                              <p className="text-xs text-gray-500 mt-2">
                                +{pkg.images.filter((img: string) => img && img.trim() !== "").length - 4} more images
                              </p>
                            )}
                          </div>
                        )}
                        {/* Package Highlights */}
                        {pkg.highlights && Array.isArray(pkg.highlights) && pkg.highlights.length > 0 && (
                          <div className="p-3 pt-0">
                            <div className="space-y-1">
                              {pkg.highlights.slice(0, 3).map((highlight: string, hIdx: number) => (
                                <div key={hIdx} className="text-gray-700 text-xs flex items-start gap-1">
                                  <span className="text-[#E51A4B]">•</span>
                                  <span>{highlight}</span>
                                </div>
                              ))}
                              {pkg.highlights.length > 3 && (
                                <p className="text-xs text-gray-500 mt-1">
                                  +{pkg.highlights.length - 3} more highlights
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Price Section (for Stays/Getaways) */}
              {(itemType === "stay" || itemType === "trip") && (
                <div className="mb-6">
                  <section className="bg-red-50 py-7 px-6 md:px-5 rounded-lg">
                    {selectedItem.includes && Array.isArray(selectedItem.includes) && selectedItem.includes.length > 0 && (
                      <div className={selectedItem.excludes && selectedItem.excludes.length > 0 ? "mb-10" : ""}>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Price Includes</h2>
                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
                          {selectedItem.includes.map((item: string, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                              <Check className="text-green-600 w-5 h-5 flex-shrink-0" />
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedItem.excludes && Array.isArray(selectedItem.excludes) && selectedItem.excludes.length > 0 && (
                      <div>
                        <h2 className="text-xl font-semibold text-gray-800 mb-6">Price Excludes</h2>
                        <div className="grid md:grid-cols-2 gap-y-4 gap-x-12 text-gray-700">
                          {selectedItem.excludes.map((item: string, index: number) => (
                            <div key={index} className="flex items-center gap-3">
                              <span className="text-red-600 w-5 h-5 flex-shrink-0 flex items-center justify-center">•</span>
                              <span>{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                </div>
              )}

              {/* Additional Details - Expandable Style */}
              {selectedItem.additionalDetails && Array.isArray(selectedItem.additionalDetails) && selectedItem.additionalDetails.length > 0 && (() => {
                const validDetails = selectedItem.additionalDetails.filter((detail: AdditionalDetail) => {
                  const hasHeading = detail.heading?.trim();
                  const hasContent = 
                    (detail.type === 'description' && detail.description?.trim()) ||
                    (detail.type === 'points' && Array.isArray(detail.points) && detail.points.length > 0);
                  return hasHeading && hasContent;
                });
                
                return validDetails.length > 0 ? (
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Additional Details</h2>
                    <div className="space-y-4">
                      {validDetails.map((detail: AdditionalDetail, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                          <div className="p-4">
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                              {detail.heading}
                            </h3>
                            {detail.type === 'description' && detail.description && (
                              <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                {detail.description}
                              </p>
                            )}
                            {detail.type === 'points' && detail.points && Array.isArray(detail.points) && detail.points.length > 0 && (
                              <ul className="list-disc list-inside space-y-2 text-gray-700 text-sm sm:text-base">
                                {detail.points.map((point: string, pointIndex: number) => (
                                  <li key={pointIndex}>{point}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Location */}
              {selectedItem.location && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Location</h2>
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="w-5 h-5 text-[#E51A4B]" />
                    <p>{selectedItem.location}</p>
                  </div>
                </div>
              )}

              {/* Reviews Section - Maximum 4 Reviews */}
              {reviews.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h2>
                  <div className="space-y-4">
                    {reviews.map((review) => {
                      const formatDate = (date: Date | string) => {
                        const d = typeof date === "string" ? new Date(date) : date;
                        return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                      };

                      const getInitials = (name: string) => {
                        return name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2);
                      };

                      return (
                        <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start gap-4">
                            {/* Avatar */}
                            <div className="w-10 h-10 rounded-full bg-[#E51A4B] text-white flex items-center justify-center font-semibold text-sm flex-shrink-0">
                              {getInitials(review.userName)}
                            </div>
                            
                            {/* Review Content */}
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold text-gray-900 text-sm">{review.userName}</h4>
                                  <p className="text-xs text-gray-500">{formatDate(review.createdAt)}</p>
                                </div>
                                {/* Star Rating */}
                                <div className="flex items-center gap-0.5">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= review.rating
                                          ? "text-yellow-400 fill-yellow-400"
                                          : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-gray-700 text-sm leading-relaxed">{review.review}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Custom Content */}
              {customContent && (
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-3 border-b-2 border-[#E51A4B] pb-2">Special Notes</h2>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {customContent}
                  </div>
                </div>
              )}

              {/* Footer */}
              <div className="mt-8 pt-6 border-t-2 border-gray-300">
                <div className="flex justify-center mb-4">
                  <Image
                    src="/assets/logo_new.png"
                    alt="Tripeloo Logo"
                    width={150}
                    height={60}
                    className="h-12 w-auto object-contain"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mb-2">
                  For bookings and inquiries, contact us at:
                </p>
                <p className="text-sm text-gray-700 text-center font-semibold mb-2">
                  Email: hello@tripeloo.com
                </p>
                <p className="text-sm text-gray-700 text-center font-semibold">
                  WhatsApp: +91 70664 44430
                </p>
                <p className="text-xs text-gray-500 text-center mt-4">
                  Generated by Tripeloo - Your trusted travel partner
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 rounded-lg p-8 text-center border border-gray-700">
              <ImageIcon className="w-16 h-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">Select a destination and item to preview brochure</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


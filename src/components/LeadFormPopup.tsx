"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, Calendar, Users, MapPin, MessageSquare } from 'lucide-react';
import { getNextWhatsAppNumber, formatWhatsAppNumber, getPrimaryWhatsAppNumber } from '@/utils/whatsapp';

interface LeadFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onSkip: () => void;
  // Optional item details for booking form
  itemName?: string;
  itemType?: 'stay' | 'activity' | 'trip';
  itemPrice?: string;
  itemDestination?: string;
}

interface Destination {
  id: string;
  name: string;
}

export function LeadFormPopup({ isOpen, onClose, onSkip, itemName, itemType, itemPrice, itemDestination }: LeadFormPopupProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    destination: '',
    travelCount: '',
    travelDate: '',
    message: '',
  });
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formAlreadyFilled, setFormAlreadyFilled] = useState(false);
  const [savedFormData, setSavedFormData] = useState<typeof formData | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showMessageField, setShowMessageField] = useState(false);
  const isMobileRef = useRef(false);
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // Detect mobile on mount and resize - optimized with RAF and debouncing
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkMobile = () => {
      const mobile = window.innerWidth < 640;
      if (mobile !== isMobileRef.current) {
        isMobileRef.current = mobile;
        setIsMobile(mobile);
      }
    };

    // Initial check
    checkMobile();

    // Optimized resize handler with RAF and debouncing
    const handleResize = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = requestAnimationFrame(() => {
        if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
        resizeTimeoutRef.current = setTimeout(checkMobile, 150);
      });
    };

    window.addEventListener('resize', handleResize, { passive: true });
    
    return () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Check if form has been filled and load saved data
  useEffect(() => {
    if (isOpen) {
      // Reset message field visibility when popup opens
      setShowMessageField(false);
      
      const filled = localStorage.getItem('leadFormFilled') === 'true';
      const savedDataStr = localStorage.getItem('leadFormData');
      const savedTimestampStr = localStorage.getItem('leadFormTimestamp');
      
      if (filled && savedDataStr && savedTimestampStr) {
        const savedTimestamp = parseInt(savedTimestampStr);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;
        
        // Check if data is still valid (within 24 hours)
        if (now - savedTimestamp < twentyFourHours) {
          try {
            const savedData = JSON.parse(savedDataStr);
            setSavedFormData(savedData);
            setFormData(savedData); // Load saved data into form
            setFormAlreadyFilled(true);
            setSubmitted(true);
          } catch (error) {
            console.error('Error parsing saved form data:', error);
            // If parsing fails, clear saved data
            localStorage.removeItem('leadFormData');
            localStorage.removeItem('leadFormTimestamp');
            localStorage.removeItem('leadFormFilled');
            setFormAlreadyFilled(false);
            setFormData({
              fullName: '',
              mobileNumber: '',
              destination: itemDestination || '',
              travelCount: '',
              travelDate: '',
              message: '',
            });
            setSubmitted(false);
          }
        } else {
          // Data expired, clear it
          localStorage.removeItem('leadFormData');
          localStorage.removeItem('leadFormTimestamp');
          localStorage.removeItem('leadFormFilled');
          setFormAlreadyFilled(false);
          setFormData({
            fullName: '',
            mobileNumber: '',
            destination: itemDestination || '',
            travelCount: '',
            travelDate: '',
            message: '',
          });
          setSubmitted(false);
        }
      } else {
        // No saved data or form not filled
        setFormAlreadyFilled(false);
        setSavedFormData(null);
        setFormData({
          fullName: '',
          mobileNumber: '',
          destination: itemDestination || '',
          travelCount: '',
          travelDate: '',
          message: '',
        });
        setSubmitted(false);
        setErrors({});
      }
    }
  }, [isOpen, itemDestination]);

  useEffect(() => {
    // Fetch destinations for dropdown
    const fetchDestinations = async () => {
      try {
        const res = await fetch('/api/admin/destinations');
        if (res.ok) {
          const data = await res.json();
          setDestinations(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching destinations:', error);
      }
    };
    fetchDestinations();
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobileNumber.trim())) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number';
    }

    if (!itemName) {
      // Only validate destination if not an item booking
      if (!formData.destination) {
        newErrors.destination = 'Please select a destination';
      }
    }

    if (!formData.travelDate) {
      newErrors.travelDate = 'Travel date is required';
    }

    if (!formData.travelCount.trim()) {
      newErrors.travelCount = 'Total members is required';
    } else if (parseInt(formData.travelCount) < 1) {
      newErrors.travelCount = 'Total members must be at least 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const destination = itemName ? (formData.destination || itemDestination || '') : formData.destination;

      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          mobileNumber: `+91${formData.mobileNumber.trim()}`,
          destination: destination,
          travelCount: parseInt(formData.travelCount || '1'),
          travelDate: formData.travelDate,
          message: formData.message.trim() || undefined,
          itemName: itemName || '',
          itemType: itemType || '',
          itemPrice: itemPrice || '',
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        // Save form data to localStorage with timestamp
        if (typeof window !== 'undefined') {
          const formDataToSave = {
            fullName: formData.fullName.trim(),
            mobileNumber: formData.mobileNumber.trim(),
            destination: destination,
            travelCount: formData.travelCount,
            travelDate: formData.travelDate,
            message: formData.message.trim() || '',
          };
          localStorage.setItem('leadFormFilled', 'true');
          localStorage.setItem('leadFormData', JSON.stringify(formDataToSave));
          localStorage.setItem('leadFormTimestamp', Date.now().toString());
          setSavedFormData(formDataToSave);
        }
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to submit. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to submit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsApp = () => {
    // Use saved form data if available, otherwise use current form data
    const dataToUse = savedFormData || formData;
    const phoneNumber = formatWhatsAppNumber(getNextWhatsAppNumber());
    const itemInfo = itemName ? `\n\nItem: ${itemName}${itemPrice ? `\nPrice: ${itemPrice}` : ''}` : '';
    const messageText = dataToUse.message ? `\n\nMessage: ${dataToUse.message}` : '';
    const message = `Hi Tripeloo!

Name: ${dataToUse.fullName}
Mobile: +91${dataToUse.mobileNumber}
Destination: ${dataToUse.destination || itemDestination || 'N/A'}
Total Members: ${dataToUse.travelCount}
Travel Date: ${dataToUse.travelDate}${messageText}${itemInfo}

I would like to discuss my travel plans.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleCall = () => {
    const phoneNumber = getPrimaryWhatsAppNumber().replace(/[\s\+-]/g, '');
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleMail = () => {
    // Use saved form data if available, otherwise use current form data
    const dataToUse = savedFormData || formData;
    const itemInfo = itemName ? `\nItem: ${itemName}${itemPrice ? `\nPrice: ${itemPrice}` : ''}` : '';
    const messageText = dataToUse.message ? `\n\nMessage: ${dataToUse.message}` : '';
    const subject = encodeURIComponent('Travel Inquiry - Lead Form Submission');
    const body = encodeURIComponent(`Hi Tripeloo,

I submitted a lead form and would like to discuss my travel plans.

Details:
Name: ${dataToUse.fullName}
Mobile: +91${dataToUse.mobileNumber}
Destination: ${dataToUse.destination || itemDestination || 'N/A'}
Total Members: ${dataToUse.travelCount}
Travel Date: ${dataToUse.travelDate}${messageText}${itemInfo}

Thank you!`);
    window.location.href = `mailto:hello@tripeloo.com?subject=${subject}&body=${body}`;
  };

  const handleSkip = () => {
    onSkip();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          {/* Backdrop with enhanced blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-2 sm:p-4 bg-black/60 backdrop-blur-md overflow-hidden"
            onClick={onClose}
            style={{
              willChange: 'opacity',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          >
        {/* Decorative gradient orbs - optimized */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.3 }}
          transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#E51A4B] rounded-full blur-3xl"
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        />
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ delay: 0.15, duration: 0.6, ease: "easeOut" }}
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        />

        {/* Main Popup */}
        <motion.div
          initial={isMobile ? { 
            y: '100%',
            opacity: 0
          } : {
            scale: 0.5,
            opacity: 0,
            y: 50
          }}
          animate={isMobile ? {
            y: 0,
            opacity: 1
          } : {
            scale: 1,
            opacity: 1,
            y: 0
          }}
          exit={isMobile ? {
            y: '100%',
            opacity: 0
          } : {
            scale: 0.8,
            opacity: 0,
            y: 30
          }}
          transition={{ 
            type: isMobile ? "tween" : "spring", 
            duration: isMobile ? 0.25 : undefined,
            stiffness: isMobile ? undefined : 400,
            damping: isMobile ? undefined : 25,
            mass: isMobile ? undefined : 0.7,
            ease: isMobile ? "easeOut" : undefined
          }}
          className="relative bg-white rounded-t-3xl sm:rounded-2xl sm:rounded-3xl shadow-2xl max-w-2xl w-full h-[75vh] sm:max-h-[90vh] flex flex-col border border-gray-100 mx-0 sm:mx-4 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
          style={{
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(229, 26, 75, 0.1)',
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        >
          {/* Animated gradient border */}
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E51A4B] via-pink-500 to-[#E51A4B]"
          />
          {/* Mobile drag handle */}
          <div className="sm:hidden absolute top-2 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gray-300 rounded-full" />
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="sticky top-0 bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 px-4 sm:px-5 py-3 flex items-center justify-between z-10 backdrop-blur-sm"
          >
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-base sm:text-lg font-bold bg-gradient-to-r from-gray-900 via-[#E51A4B] to-gray-900 bg-clip-text text-transparent font-display truncate flex-1 min-w-0 mr-2"
            >
              {(formAlreadyFilled || submitted) ? 'Connect Tripeloo Support' : itemName ? itemName : 'Plan Your Trip'}
            </motion.h2>
            <motion.button
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </motion.button>
          </motion.div>

          {/* Content */}
          <div className="p-4 sm:p-5 flex-1 overflow-x-hidden sm:overflow-y-auto">
            {(formAlreadyFilled || submitted) ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center space-y-6"
              >
                {/* Success Icon with multiple animations */}
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    delay: 0.2, 
                    type: "spring",
                    stiffness: 200,
                    damping: 15
                  }}
                  className="relative w-24 h-24 mx-auto"
                >
                  {/* Pulsing ring */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0.8 }}
                    animate={{ scale: 2, opacity: 0 }}
                    transition={{ 
                      delay: 0.4,
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 2
                    }}
                    className="absolute inset-0 bg-green-400 rounded-full"
                  />
                  {/* Main circle */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                    className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <motion.svg
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.8 }}
                      className="w-12 h-12 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </motion.svg>
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3 font-display bg-gradient-to-r from-gray-900 to-[#E51A4B] bg-clip-text text-transparent">
                    Our team will get back to you!
                  </h3>
                  <p className="text-gray-600 text-lg">
                    We've received your information and will contact you shortly.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="pt-6"
                >
                  <h4 className="text-xl font-semibold text-gray-900 mb-6 font-display">
                    Connect Tripeloo Support
                  </h4>
                  <div className="flex items-center justify-center gap-6">
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.15, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleWhatsApp}
                      className="relative p-5 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all"
                      title="WhatsApp"
                    >
                      {/* WhatsApp Icon SVG */}
                      <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      <motion.div
                        className="absolute inset-0 rounded-full bg-green-400 opacity-0"
                        whileHover={{ opacity: 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.1, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.15, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCall}
                      className="relative p-5 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all"
                      title="Call"
                    >
                      <Phone className="w-7 h-7" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-blue-400 opacity-0"
                        whileHover={{ opacity: 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                    <motion.button
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
                      whileHover={{ scale: 1.15, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMail}
                      className="relative p-5 bg-gradient-to-br from-[#E51A4B] to-red-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all"
                      title="Email"
                    >
                      <Mail className="w-7 h-7" />
                      <motion.div
                        className="absolute inset-0 rounded-full bg-pink-400 opacity-0"
                        whileHover={{ opacity: 0.3 }}
                        transition={{ duration: 0.2 }}
                      />
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Item Info Display (if item booking) */}
                {itemName && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 rounded-lg p-3 mb-2 border border-gray-200"
                  >
                    <h3 className="font-semibold text-gray-900 text-sm mb-0.5">{itemName}</h3>
                    {itemPrice && (
                      <p className="text-base font-bold text-[#E51A4B]">{itemPrice}</p>
                    )}
                  </motion.div>
                )}

                {/* Full Name */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Full Name
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className={`w-full min-w-0 px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] transition-all ${
                      errors.fullName ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                    }`}
                    placeholder="Enter your full name"
                  />
                  <AnimatePresence>
                    {errors.fullName && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm text-red-500"
                      >
                        {errors.fullName}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Mobile Number */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                >
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                    Mobile Number
                  </label>
                  <div className="flex items-center">
                    <motion.span
                      whileHover={{ scale: 1.02 }}
                      className="px-3 py-2.5 text-sm bg-gradient-to-r from-gray-100 to-gray-50 border border-r-0 border-gray-300 rounded-l-lg text-gray-700 font-medium flex-shrink-0"
                    >
                      +91
                    </motion.span>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="tel"
                      value={formData.mobileNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                        handleInputChange('mobileNumber', value);
                      }}
                      className={`flex-1 min-w-0 px-3 py-2.5 text-sm border rounded-r-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] transition-all ${
                        errors.mobileNumber ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Enter your mobile number"
                    />
                  </div>
                  <AnimatePresence>
                    {errors.mobileNumber && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-1 text-sm text-red-500"
                      >
                        {errors.mobileNumber}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </motion.div>

                {/* Destination - Only show if not item booking */}
                {!itemName && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-[#E51A4B]" />
                      Pick Your Wished Destination
                    </label>
                    <motion.select
                      whileFocus={{ scale: 1.01 }}
                      value={formData.destination}
                      onChange={(e) => handleInputChange('destination', e.target.value)}
                      className={`w-full min-w-0 px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] transition-all ${
                        errors.destination ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <option value="">Select a destination</option>
                      {destinations.map((dest) => (
                        <option key={dest.id} value={dest.name}>
                          {dest.name}
                        </option>
                      ))}
                    </motion.select>
                    <AnimatePresence>
                      {errors.destination && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-1 text-sm text-red-500"
                        >
                          {errors.destination}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Total Members and Date of Travel - Single Row */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Total Members */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#E51A4B]" />
                      Total Members
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="number"
                      min="1"
                      value={formData.travelCount}
                      onChange={(e) => handleInputChange('travelCount', e.target.value)}
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] transition-all ${
                        errors.travelCount ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                      placeholder="Members"
                    />
                    <AnimatePresence>
                      {errors.travelCount && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-1 text-xs text-red-500"
                        >
                          {errors.travelCount}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>

                  {/* Date of Travel */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                      Date of Travel
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="date"
                      value={formData.travelDate}
                      onChange={(e) => handleInputChange('travelDate', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full px-3 py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] transition-all ${
                        errors.travelDate ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    />
                    <AnimatePresence>
                      {errors.travelDate && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-1 text-xs text-red-500"
                        >
                          {errors.travelDate}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </motion.div>
                </div>

                {/* Message - Optional - Show only if clicked */}
                <AnimatePresence>
                  {showMessageField ? (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-[#E51A4B]" />
                        Message <span className="text-xs text-gray-500 font-normal">(Optional)</span>
                      </label>
                      <motion.textarea
                        whileFocus={{ scale: 1.01 }}
                        value={formData.message}
                        onChange={(e) => handleInputChange('message', e.target.value)}
                        rows={2}
                        className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#E51A4B] transition-all hover:border-gray-400 resize-none"
                        placeholder="Any special requests or questions..."
                      />
                    </motion.div>
                  ) : (
                    <motion.button
                      type="button"
                      onClick={() => setShowMessageField(true)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                      className="w-full text-left text-xs text-[#E51A4B] hover:text-red-600 font-medium py-2 flex items-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      Any other info?
                    </motion.button>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="flex items-center gap-3 pt-4"
                >
                  {!itemName && (
                    <motion.button
                      type="button"
                      onClick={handleSkip}
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all shadow-sm min-w-0"
                    >
                      Skip
                    </motion.button>
                  )}
                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileHover={!loading ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!loading ? { scale: 0.98 } : {}}
                    className={`${itemName ? 'w-full' : 'flex-1'} px-4 py-2.5 text-sm bg-gradient-to-r from-[#E51A4B] to-red-600 text-white rounded-lg font-semibold hover:from-red-600 hover:to-red-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden min-w-0`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        Submitting...
                      </span>
                    ) : (
                      <span className="relative z-10">Submit</span>
                    )}
                    {!loading && (
                      <motion.div
                        className="absolute inset-0 bg-white opacity-0"
                        whileHover={{ opacity: 0.1 }}
                        transition={{ duration: 0.2 }}
                      />
                    )}
                  </motion.button>
                </motion.div>
              </form>
            )}
          </div>
        </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


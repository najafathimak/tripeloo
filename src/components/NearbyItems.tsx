"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary';

interface NearbyItem {
  _id?: string;
  id?: string;
  name: string;
  coverImage: string;
  startingPrice: number;
  location?: string;
  summary?: string;
}

interface NearbyItemsProps {
  title: string;
  itemIds: string[];
  itemType: 'stay' | 'activity' | 'trip';
  emptyMessage?: string;
}

export default function NearbyItems({ title, itemIds, itemType, emptyMessage }: NearbyItemsProps) {
  const [items, setItems] = useState<NearbyItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      console.log(`[NearbyItems] ${title} - itemIds:`, itemIds, 'itemType:', itemType);
      if (!itemIds || itemIds.length === 0) {
        console.log(`[NearbyItems] ${title} - No itemIds, skipping`);
        setLoading(false);
        return;
      }

      try {
        const fetchPromises = itemIds.map(async (id) => {
          let endpoint = '';
          if (itemType === 'stay') {
            endpoint = `/api/stays/${encodeURIComponent(id)}`;
          } else if (itemType === 'activity') {
            endpoint = `/api/activities/${encodeURIComponent(id)}`;
          } else if (itemType === 'trip') {
            endpoint = `/api/trips/${encodeURIComponent(id)}`;
          }

          if (!endpoint) {
            console.log(`[NearbyItems] ${title} - No endpoint for id:`, id);
            return null;
          }

          console.log(`[NearbyItems] ${title} - Fetching:`, endpoint);
          const res = await fetch(endpoint);
          if (res.ok) {
            const data = await res.json();
            console.log(`[NearbyItems] ${title} - Fetched item:`, data.data?.name);
            return data.data;
          } else {
            console.error(`[NearbyItems] ${title} - Failed to fetch ${endpoint}:`, res.status);
          }
          return null;
        });

        const results = await Promise.all(fetchPromises);
        const validItems = results.filter((item): item is NearbyItem => item !== null);
        console.log(`[NearbyItems] ${title} - Valid items:`, validItems.length, validItems.map(i => i.name));
        setItems(validItems);
      } catch (error) {
        console.error(`[NearbyItems] ${title} - Error fetching nearby items:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [itemIds, itemType, title]);

  if (loading) {
    return null; // Don't show loading state, just hide if loading
  }

  if (!items || items.length === 0) {
    return null; // Don't render if no items
  }

  const getDetailUrl = (item: NearbyItem) => {
    const itemId = item._id?.toString() || item.id || '';
    if (itemType === 'stay') {
      return `/item-details?stay=${encodeURIComponent(itemId)}`;
    } else if (itemType === 'activity') {
      return `/things-to-do?things-to-do=${encodeURIComponent(itemId)}`;
    } else if (itemType === 'trip') {
      return `/trips?trips=${encodeURIComponent(itemId)}`;
    }
    return '#';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <section className="px-4 sm:px-6 mb-8 sm:mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-6"
      >
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 font-display mb-2">
          {title}
        </h2>
        <div className="w-20 h-1 bg-gradient-to-r from-[#E51A4B] to-pink-500 rounded-full"></div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item, index) => {
          const itemId = item._id?.toString() || item.id || '';
          const detailUrl = getDetailUrl(item);
          
          return (
            <motion.div
              key={itemId}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              <Link href={detailUrl}>
                <div className="relative h-48 sm:h-56 overflow-hidden">
                  <Image
                    src={optimizeCloudinaryUrl(item.coverImage)}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  
                  {/* Price Badge */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg">
                    <span className="text-sm font-bold text-[#E51A4B]">
                      {formatPrice(item.startingPrice)}
                    </span>
                  </div>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 line-clamp-2 font-display group-hover:text-[#E51A4B] transition-colors">
                    {item.name}
                  </h3>
                  
                  {item.location && (
                    <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-3">
                      <MapPin className="w-4 h-4 text-[#E51A4B]" />
                      <span className="line-clamp-1">{item.location}</span>
                    </div>
                  )}

                  {item.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                      {item.summary}
                    </p>
                  )}

                  {/* CTA Button */}
                  <motion.div
                    whileHover={{ x: 5 }}
                    className="inline-flex items-center gap-2 text-[#E51A4B] font-semibold text-sm group-hover:gap-3 transition-all"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}


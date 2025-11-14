"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TripForm from "@/components/AdminPanel/form/TripForm";
import { Loader2 } from "lucide-react";

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [tripData, setTripData] = useState<any>(null);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const id = params.id as string;
        const res = await fetch(`/api/admin/trips/${id}`);
        if (res.ok) {
          const data = await res.json();
          setTripData(data.data);
        } else {
          alert("Trip not found");
          router.push("/admin/trips");
        }
      } catch (error) {
        console.error("Error fetching trip:", error);
        alert("Failed to load trip");
        router.push("/admin/trips");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTrip();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E51A4B]" />
      </div>
    );
  }

  if (!tripData) {
    return null;
  }

  return <TripForm initialData={tripData} isEdit={true} />;
}


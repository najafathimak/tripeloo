"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DestinationForm from "@/components/AdminPanel/form/DestinationForm";
import { Loader2 } from "lucide-react";

export default function EditDestinationPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [destinationData, setDestinationData] = useState<any>(null);

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const id = params.id as string;
        const res = await fetch(`/api/admin/destinations/${id}`);
        if (res.ok) {
          const data = await res.json();
          setDestinationData(data.data);
        } else {
          alert("Destination not found");
          router.push("/admin/destinations");
        }
      } catch (error) {
        console.error("Error fetching destination:", error);
        alert("Failed to load destination");
        router.push("/admin/destinations");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchDestination();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E51A4B]" />
      </div>
    );
  }

  if (!destinationData) {
    return null;
  }

  return <DestinationForm initialData={destinationData} isEdit={true} />;
}


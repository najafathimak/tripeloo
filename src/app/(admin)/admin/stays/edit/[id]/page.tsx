"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import StayForm from "@/components/AdminPanel/form/StayForm";
import { Loader2 } from "lucide-react";

export default function EditStayPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stayData, setStayData] = useState<any>(null);

  useEffect(() => {
    const fetchStay = async () => {
      try {
        const id = params.id as string;
        const res = await fetch(`/api/admin/stays/${id}`);
        if (res.ok) {
          const data = await res.json();
          setStayData(data.data);
        } else {
          alert("Stay not found");
          router.push("/admin/stays");
        }
      } catch (error) {
        console.error("Error fetching stay:", error);
        alert("Failed to load stay");
        router.push("/admin/stays");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchStay();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E51A4B]" />
      </div>
    );
  }

  if (!stayData) {
    return null;
  }

  return <StayForm initialData={stayData} isEdit={true} />;
}


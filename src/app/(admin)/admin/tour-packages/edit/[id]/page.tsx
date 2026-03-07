"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import TourPackageForm from "@/components/AdminPanel/form/TourPackageForm";
import { Loader2 } from "lucide-react";

export default function EditTourPackagePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [packageData, setPackageData] = useState<any>(null);

  useEffect(() => {
    const fetchPackage = async () => {
      try {
        const id = params.id as string;
        const res = await fetch(`/api/admin/tour-packages/${encodeURIComponent(id)}`);
        if (res.ok) {
          const data = await res.json();
          setPackageData(data.data);
        } else {
          alert("Tour package not found");
          router.push("/admin/tour-packages");
        }
      } catch (error) {
        console.error("Error fetching tour package:", error);
        alert("Failed to load tour package");
        router.push("/admin/tour-packages");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPackage();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E51A4B]" />
      </div>
    );
  }

  if (!packageData) {
    return null;
  }

  return <TourPackageForm initialData={packageData} isEdit={true} />;
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ActivityForm from "@/components/AdminPanel/form/ActivityForm";
import { Loader2 } from "lucide-react";

export default function EditActivityPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activityData, setActivityData] = useState<any>(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const id = params.id as string;
        const res = await fetch(`/api/admin/activities/${id}`);
        if (res.ok) {
          const data = await res.json();
          setActivityData(data.data);
        } else {
          alert("Activity not found");
          router.push("/admin/things");
        }
      } catch (error) {
        console.error("Error fetching activity:", error);
        alert("Failed to load activity");
        router.push("/admin/things");
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchActivity();
    }
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-[#E51A4B]" />
      </div>
    );
  }

  if (!activityData) {
    return null;
  }

  return <ActivityForm initialData={activityData} isEdit={true} />;
}


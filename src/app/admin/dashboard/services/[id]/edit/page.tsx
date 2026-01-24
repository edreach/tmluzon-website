import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceForm from "../../../service-form";
import { serviceListings } from "@/lib/data";
import { notFound } from "next/navigation";
import type { Service } from "@/lib/types";

export default function EditServicePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const serviceListing = serviceListings.find(p => p.id === id);

  if (!serviceListing) {
    notFound();
  }

  const serviceForForm: Service = serviceListing;

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Edit Service</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>Edit: {serviceForForm.name}</CardTitle>
            <CardDescription>Update your service details and use AI to enhance descriptions.</CardDescription>
        </CardHeader>
        <CardContent>
            <ServiceForm service={serviceForForm} />
        </CardContent>
      </Card>
    </>
  );
}

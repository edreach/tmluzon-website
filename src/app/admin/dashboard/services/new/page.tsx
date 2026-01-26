import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import ServiceForm from "../../service-form";
import type { Service } from "@/lib/types";

export default function NewServicePage() {
  const newService: Service = {
      id: 'new',
      name: '',
      description: '',
      imageUrls: [],
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Create Service</h1>
      </div>
      <Card>
        <CardHeader>
            <CardTitle>New Service Details</CardTitle>
            <CardDescription>Fill out the form to add a new service to your catalog.</CardDescription>
        </CardHeader>
        <CardContent>
            <ServiceForm service={newService} />
        </CardContent>
      </Card>
    </>
  );
}

    
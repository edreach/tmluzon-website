
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getServices } from "@/lib/data-server";

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl font-headline">
            Our Services
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            Professional solutions to keep you comfortable, year-round.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services?.map((service) => (
            <Card key={service.id} className="overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl flex flex-col">
              <div className="relative w-full h-48 bg-muted">
                {service.imageUrls && service.imageUrls.length > 0 ? (
                    <Image
                      src={service.imageUrls[0]}
                      alt={service.name}
                      fill
                      className="object-cover"
                      data-ai-hint="mechanic working"
                    />
                ) : (
                    <Image
                      src={`https://picsum.photos/seed/${service.id}/600/400`}
                      alt={service.name}
                      fill
                      className="object-cover"
                      data-ai-hint="placeholder image"
                    />
                )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-xl font-bold">{service.name}</h3>
                <p className="text-muted-foreground text-sm mt-2 mb-6 flex-grow whitespace-pre-wrap">
                  {service.description}
                </p>
                <Button asChild variant="outline" className="w-full mt-auto">
                  <Link href={`/services/${service.id}`}>View Details</Link>
                </Button>
              </div>
            </Card>
          ))}
          {services?.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No services have been added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

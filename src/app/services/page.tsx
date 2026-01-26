'use client';

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCollection, useFirestore, useMemoFirebase } from "@/firebase";
import { collection, query } from "firebase/firestore";
import type { Service, ServiceData } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function ServicesPage() {
  const firestore = useFirestore();
  const servicesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'services')) : null),
    [firestore]
  );
  const { data: services, isLoading } = useCollection<ServiceData>(servicesQuery);

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
          {isLoading && Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="overflow-hidden rounded-xl shadow-md flex flex-col">
              <Skeleton className="h-48 w-full" />
              <div className="p-6 flex flex-col flex-grow">
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3 mb-6" />
                <Skeleton className="h-10 w-full mt-auto" />
              </div>
            </Card>
          ))}
          {!isLoading && services?.map((service) => (
            <Card key={service.id} className="overflow-hidden rounded-xl shadow-md transition-shadow duration-300 hover:shadow-xl flex flex-col">
              <div className="relative w-full h-48 bg-muted">
                <Image
                  src={service.imageUrls?.[0] || `https://picsum.photos/seed/${service.id}/600/400`}
                  alt={service.name}
                  fill
                  className="object-cover"
                  data-ai-hint="mechanic working"
                />
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
          {!isLoading && services?.length === 0 && (
            <p className="col-span-full text-center text-muted-foreground">
              No services have been added yet.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

    
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function Home() {
  const services = [
    {
      title: "Fast & Reliable Aircon Repair",
      description: "Facing a broken AC? Our certified technicians provide fast, expert repair for any aircon problem, offering honest, long-lasting solutions with transparent pricing ...",
      imageUrl: "https://picsum.photos/seed/aircon-repair/600/400",
      imageHint: "person sunset"
    },
    {
      title: "Keep Your Cool & Lower Your Bills: Expert Aircon Maintenance",
      description: "Invest in worry-free comfort with our Aircon Preventive Maintenance Service. We restore peak efficiency, lower energy costs, and prevent costly breakdowns through...",
      imageUrl: "https://picsum.photos/seed/aircon-maintenance/600/400",
      imageHint: "person field"
    },
    {
      title: "The Ultimate Cooling Solution: Expert AC Planning, Design & Installation",
      description: "Our integrated service provides expert planning, design, and installation of highly efficient cooling systems for new homes and major renovations in Bacoor. We ensu...",
      imageUrl: "https://picsum.photos/seed/aircon-install/600/400",
      imageHint: "person light"
    }
  ];

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            Comprehensive HVAC Solutions
          </h1>
          <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
            From installation to maintenance and emergency repairs, we offer a complete range of services to keep your systems running efficiently.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3">
          {services.map((service) => (
            <Card key={service.title} className="overflow-hidden rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-xl">
              <div className="relative w-full h-48">
                <Image
                  src={service.imageUrl}
                  alt={service.title}
                  fill
                  className="object-cover"
                  data-ai-hint={service.imageHint}
                />
              </div>
              <div className="p-6">
                <h3 className="text-lg font-bold h-20">{service.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {service.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Button size="lg">View All Services</Button>
        </div>
      </div>
    </div>
  );
}

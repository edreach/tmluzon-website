import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ShieldCheck, Truck } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { productListings } from "@/lib/data";

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

  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6" />,
      title: "Best quality",
      description: "We are committed to providing the highest quality products and services to our customers.",
    },
    {
      icon: <Truck className="h-6 w-6" />,
      title: "Free shipping",
      description: "Enjoy free shipping on all orders, with no minimum purchase required.",
    },
    {
      icon: <Award className="h-6 w-6" />,
      title: "Warranty",
      description: "All our products come with a one-year warranty, ensuring peace of mind.",
    },
  ]

  return (
    <div className="bg-background text-foreground">
      <div className="container mx-auto px-4 py-16 sm:py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 relative rounded-xl overflow-hidden shadow-lg h-[450px]">
                <Image src="https://picsum.photos/seed/rainy-promo/1200/900" alt="Rainy Season Promo" fill className="object-cover brightness-75" data-ai-hint="night sky church" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-8 md:p-12 text-white">
                    <h2 className="text-3xl md:text-4xl font-bold">Rainy Season Promo</h2>
                    <div className="mt-2 text-sm flex items-center flex-wrap gap-x-2">
                        <span>TM Luzon Engineering Sales & Services Company</span>
                        <span>&bull;</span>
                        <span>Prime Asiatique</span>
                    </div>
                    <p className="text-sm mt-1">Commercial Center, Buhay Na Tubig I</p>
                    <Button className="mt-4 w-fit">Read More</Button>
                </div>
            </div>

            {/* Right Column */}
            <div className="flex flex-col gap-8">
                {/* Top small card */}
                <div className="relative rounded-xl overflow-hidden shadow-lg flex-1 h-[209px]">
                    <Image src="https://picsum.photos/seed/hiring1/600/400" alt="We are hiring" fill className="object-cover brightness-75" data-ai-hint="cactus plant" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative h-full flex items-end p-6 text-white">
                        <h3 className="text-2xl font-bold">We Are Hiring</h3>
                    </div>
                </div>
                {/* Bottom small card */}
                <div className="relative rounded-xl overflow-hidden shadow-lg flex-1 h-[209px]">
                    <Image src="https://picsum.photos/seed/hiring2/600/400" alt="We are hiring" fill className="object-cover brightness-75" data-ai-hint="grass field" />
                    <div className="absolute inset-0 bg-black/40" />
                    <div className="relative h-full flex items-end p-6 text-white">
                        <h3 className="text-2xl font-bold">We Are Hiring!</h3>
                    </div>
                </div>
            </div>
        </div>
        
        <div className="text-center mt-16">
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

        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Why choose us?
          </h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            The benefits that will make you comfort
          </p>

          <div className="mt-16 grid grid-cols-1 gap-y-12 gap-x-8 md:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="flex flex-col items-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-primary text-primary-foreground">
                  {feature.icon}
                </div>
                <h3 className="mt-6 text-lg font-medium">{feature.title}</h3>
                <p className="mt-2 text-base text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-24">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl font-headline">
              Featured Products
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              Check out our top-of-the-line HVAC units, designed for maximum efficiency and reliability.
            </p>
          </div>
          <div className="mt-16">
            <Carousel
              opts={{
                align: "start",
              }}
              className="w-full max-w-6xl mx-auto"
            >
              <CarouselContent>
                {productListings.slice(0, 8).map((product) => (
                  <CarouselItem key={product.id} className="sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                    <div className="p-1 h-full">
                      <Card className="overflow-hidden flex flex-col h-full">
                        <div className="relative w-full h-48 bg-muted">
                          <Image
                            src={`https://picsum.photos/seed/${product.id}/400/400`}
                            alt={product.name}
                            fill
                            className="object-cover"
                            data-ai-hint="hvac unit"
                          />
                        </div>
                        <CardContent className="p-4 text-center flex flex-col flex-grow">
                          <h3 className="font-semibold text-sm h-10 truncate flex-grow" title={product.name}>{product.name}</h3>
                          <p className="text-xs text-muted-foreground uppercase">{product.subType}</p>
                          <Button asChild size="sm" className="mt-4">
                            <Link href="/products">View Details</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-4 md:-left-12" />
              <CarouselNext className="-right-4 md:-right-12" />
            </Carousel>
          </div>
          <div className="mt-8 text-center">
            <Button size="lg" asChild>
              <Link href="/products">View All Products</Link>
            </Button>
          </div>
        </div>

      </div>
    </div>
  );
}
